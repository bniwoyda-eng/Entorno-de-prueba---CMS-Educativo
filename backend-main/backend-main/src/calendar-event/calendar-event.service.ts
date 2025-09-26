import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource, FindOptionsWhere, In, MoreThanOrEqual, Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CalendarEventQueryDto, CreateCalendarEventDto, UpdateCalendarEventDto } from './dto';
import { EducatorService } from 'src/educator/educator.service';
import { CalendarEvent, CalendarEventTag } from './entities';
import { S3Service } from 'src/s3/s3.service';
import { Tag, User } from 'src/exports/entities';
import { ValidRoles } from 'src/auth';

@Injectable()
export class CalendarEventService {

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CalendarEvent) private calendarEventRepository: Repository<CalendarEvent>,
    @InjectRepository(CalendarEventTag) private calendarEventTagRepository: Repository<CalendarEventTag>,
    private readonly s3Service: S3Service,
    private readonly educatorService: EducatorService,
  ) { }

  async create(user: User, file: Express.Multer.File, dto: CreateCalendarEventDto) {
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new UnauthorizedException('User does not have an associated educator');

    const uploadResult = file ? await this.s3Service.uploadImage(file, 'calendar-events') : null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const creatorIsAdmin = user.roles.includes(ValidRoles.admin);

    try {
      // 1. Guardar el evento en base de datos
      const calendarEvent = this.calendarEventRepository.create({
        ...dto,
        type: creatorIsAdmin ? 'global' : 'institution',
        institution: creatorIsAdmin ? null : educator.institution,
        user,
        bannerUrl: uploadResult?.key || null, // Guardamos solo la key en la BD
      });
      const savedCalendarEvent = await queryRunner.manager.save(calendarEvent);

      // 2. Guardar etiquetas
      const tags: Tag[] = [];
      const { tagsIds = [] } = dto;

      if (tagsIds.length > 0) {
        for (const tagId of tagsIds) {
          await queryRunner.manager.save(this.calendarEventTagRepository.create({
            calendarEvent: savedCalendarEvent,
            tag: { id: tagId },
          }));
        }

        const foundTags = await queryRunner.manager.findBy(Tag, { id: In(tagsIds) });
        tags.push(...foundTags);
      }

      await queryRunner.commitTransaction();

      // 3. Devolver evento + URL pública del banner
      return {
        ...savedCalendarEvent,
        bannerUrl: uploadResult?.url || null, // sobrescribimos con URL accesible
        tags,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (uploadResult) {
        try {
          await this.s3Service.deleteFile(uploadResult.key);
        } catch (cleanupError) {
          console.warn('Failed to clean up file:', uploadResult.key);
        }
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(user: User, dto: CalendarEventQueryDto) {
    // Verificamos que el usuario tenga un educador asociado
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new UnauthorizedException('User does not have an associated educator');

    const incoming = dto.incoming === 'true';

    // 🧠 Construcción condicional del filtro
    let where: FindOptionsWhere<CalendarEvent>[] = [];

    switch (dto.filter) {
      case 'global':
        where = [{ type: 'global' }];
        break;
      case 'institution':
        where = [{ type: 'institution', institution: { id: educator.institution.id } }];
        break;
      case 'personal':
        where = [{ user: { id: user.id } }];
        break;
      default:
        // 'all' o no especificado: todos los tipos relevantes para el usuario
        where = [
          { type: 'global' },
          { type: 'institution', institution: { id: educator.institution.id } },
          { user: { id: user.id } },
        ];
        break;
    }

    console.log({ incoming })

    const [data, total] = await this.calendarEventRepository.findAndCount({
      where: where.map((condition) => ({
        ...condition,
        calendarEventTags: dto.tag ? { tag: { id: dto.tag } } : undefined,
        startDate: incoming ? MoreThanOrEqual(new Date()) : undefined,
      })),
      order: { startDate: 'ASC' },
      relations: ['calendarEventTags', 'calendarEventTags.tag'],
    });

    // Presignamos las urls de los banners
    for (const event of data) {
      if (event.bannerUrl) {
        try {
          event.bannerUrl = await this.s3Service.getPresignedUrl(event.bannerUrl);
        } catch (error) {
          console.warn('Failed to presign banner URL:', event.bannerUrl, error);
          event.bannerUrl = null;
        }
      }
    }

    return {
      data,
      total,
    }

  }

  async findOne(user: User, id: string) {
    // Verificamos que el usuario tenga un educador asociado
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new UnauthorizedException('User does not have an associated educator');

    const calendarEvent = await this.calendarEventRepository.findOne({
      where: { id },
      relations: ['user', 'institution',],
    });
    if (!calendarEvent) throw new NotFoundException(`Calendar event with ID ${id} not found`);

    return calendarEvent;

  }

  async update(id: string, user: User, file: Express.Multer.File, dto: UpdateCalendarEventDto) {
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new UnauthorizedException('User does not have an associated educator');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const calendarEvent = await queryRunner.manager.findOne(this.calendarEventRepository.target, {
        where: { id },
        relations: ['calendarEventTags', 'calendarEventTags.tag', 'user', 'institution'],
      });

      if (!calendarEvent) throw new NotFoundException(`Calendar event with ID ${id} not found`);

      // Actualizar campos del evento
      Object.assign(calendarEvent, dto);

      // Si hay archivo nuevo, eliminar el anterior y subir el nuevo
      if (file) {
        if (calendarEvent.bannerUrl) {
          try {
            await this.s3Service.deleteFile(calendarEvent.bannerUrl);
          } catch (error) {
            console.warn('Failed to delete old image:', calendarEvent.bannerUrl);
          }
        }
        const uploadResult = await this.s3Service.uploadImage(file, 'calendar-events');
        calendarEvent.bannerUrl = uploadResult.key;
      }

      // Guardar evento con cambios
      const savedCalendarEvent = await queryRunner.manager.save(calendarEvent);

      // Eliminar tags existentes
      await queryRunner.manager.delete(CalendarEventTag, {
        calendarEvent: { id: savedCalendarEvent.id },
      });

      // Agregar nuevos tags
      const tags: Tag[] = [];
      const { tagsIds = [] } = dto;

      if (tagsIds.length > 0) {
        for (const tagId of tagsIds) {
          const newTag = this.calendarEventTagRepository.create({
            calendarEvent: savedCalendarEvent, // aseguramos referencia válida
            tag: { id: tagId },
          });
          await queryRunner.manager.save(newTag);
        }

        const foundTags = await queryRunner.manager.findBy(Tag, { id: In(tagsIds) });
        tags.push(...foundTags);
      }

      await queryRunner.commitTransaction();

      return {
        ...savedCalendarEvent,
        tags,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error updating calendar event:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removeImage(id: string, user: User) {
    try {
      // Verificamos que el usuario tenga un educador asociado
      const educator = await this.educatorService.findByUserId(user.id);
      if (!educator) throw new UnauthorizedException('User does not have an associated educator');
      const calendarEvent = await this.calendarEventRepository.findOne({
        where: { id, user: { id: user.id } },
      });
      if (!calendarEvent) throw new NotFoundException(`Calendar event with ID ${id} not found`);

      // Eliminamos la imagen del evento
      if (calendarEvent.bannerUrl) {
        await this.s3Service.deleteFile(calendarEvent.bannerUrl);
        calendarEvent.bannerUrl = null; // Limpiamos la URL en la BD
        await this.calendarEventRepository.save(calendarEvent);
      }
      return id; // Retornamos el ID del evento para confirmar la eliminación de la imagen
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new UnauthorizedException(`Image for calendar event with ID ${id} not found`);
    }
  }

  async remove(id: string, user: User) {
    try {
      // Verificamos que el usuario tenga un educador asociado
      const educator = await this.educatorService.findByUserId(user.id);
      if (!educator) throw new UnauthorizedException('User does not have an associated educator');
      const calendarEvent = await this.calendarEventRepository.findOne({
        where: { id, user: { id: user.id } },
      });
      if (!calendarEvent) throw new NotFoundException(`Calendar event with ID ${id} not found`);

      // Eliminamos el evento del calendario
      calendarEvent.delete_date = new Date();
      await this.calendarEventRepository.save(calendarEvent);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new UnauthorizedException(`Post with ID ${id} not found`);
    }
  }

}
