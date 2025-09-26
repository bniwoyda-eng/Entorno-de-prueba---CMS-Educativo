import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { DataSource,  EntityTarget } from 'typeorm';

@Injectable()
export class ExistsInDbPipe implements PipeTransform {
  constructor(private readonly dataSource: DataSource) { }

  async transform(value: any, metadata: ArgumentMetadata) {
    const { type, metatype } = metadata;

    // Asegurarse de que estamos recibiendo un valor del tipo correcto
    if (type === 'body' && metatype) {
      const [entityClass, fieldName = 'id'] = metadata?.data ? metadata.data.split(':') : [];

      // Si no se proporciona una entidad, lanzamos un error
      if (!entityClass) {
        throw new Error('No se proporcionó una entidad para validar');
      }

      const repository = this.dataSource.getRepository(entityClass as EntityTarget<any>);

      // Usamos el valor para buscar el registro, con el campo por defecto 'id' o el campo que pasemos
      const entity = await repository.findOne({ where: { [fieldName]: value } });

      if (!entity) {
        throw new BadRequestException(`El registro con ${fieldName}: ${value} no existe en la base de datos`);
      }
    }

    return value;
  }
}
