import { DataSource, In, IsNull, Not, Raw, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

import {
  Chat,
  Course,
  Educator,
  EducatorEnrollment,
  EducatorProgress,
  Institution,
  Lesson,
  Material,
  Message,
  Post,
  Student,
  StudentEnrollment,
  StudentProgress,
  Tag,
  User,
} from 'src/exports/entities';

import { Quiz } from 'src/quiz/entities';
import { AnswerOptions } from 'src/answer-option/entities';
import { Answer } from 'src/answer/entities';
import { Question } from 'src/question/entities';
import { QuestionType } from 'src/question/enums';

import { courses, institutions, studentUsers } from './data';
import { ValidRoles } from 'src/auth/interfaces';
import { StudentService } from 'src/student/student.service';
import { Resource, ResourceAttachment, ResourceComment } from 'src/resources/entities';
import { ResourceStatus, ResourceType } from 'src/resources/types';
import { educatorUsers, adminUsers } from './data/users';
import { MaterialType } from 'src/materials/enums';
import { PostImage, PostTag } from 'src/post/entities';
import { S3Service } from 'src/s3/s3.service';
import { SlugAdapter } from 'src/utils';
import { PostComment } from '../post/entities/post-comment.entity';
import { CalendarEvent } from '../calendar-event/entities/calendar-event.entity';
import { CalendarEventTag } from '../calendar-event/entities/calendar-event-tag.entity';
import { ECalendarEvent } from 'src/calendar-event/calendar-event.types';
import { Assessment, AssessmentAnswerOption, AssessmentCategory, AssessmentQuestion, AssessmentQuestionPivot, AssessmentRiskSegment } from 'src/assessment/entities';
@Injectable()
export class SeedService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,
    private readonly studentService: StudentService,

    @InjectRepository(Course) private readonly coursesRepo: Repository<Course>,
    @InjectRepository(Lesson) private readonly lessonsRepo: Repository<Lesson>,
    @InjectRepository(Material) private readonly materialsRepo: Repository<Material>,
    @InjectRepository(Quiz) private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(Question) private readonly questionsRepo: Repository<Question>,
    @InjectRepository(AnswerOptions) private readonly answerOptionsRepo: Repository<AnswerOptions>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    @InjectRepository(StudentEnrollment) private readonly studentEnrollmentRepo: Repository<StudentEnrollment>,
    @InjectRepository(EducatorEnrollment) private readonly educatorEnrollmentRepo: Repository<EducatorEnrollment>,
    @InjectRepository(StudentProgress) private readonly studentProgressRepo: Repository<StudentProgress>,
    @InjectRepository(EducatorProgress) private readonly educatorProgressRepo: Repository<EducatorProgress>,
    @InjectRepository(Institution) private readonly institutionsRepo: Repository<Institution>,
    @InjectRepository(Educator) private readonly educatorsRepo: Repository<Educator>,
    @InjectRepository(Student) private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Resource) private readonly resourceRepo: Repository<Resource>,
    @InjectRepository(ResourceComment) private readonly resourceCommentRepo: Repository<ResourceComment>,
    @InjectRepository(ResourceAttachment) private readonly resourceAttachmentRepo: Repository<ResourceAttachment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,

    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(PostImage) private readonly postImageRepo: Repository<PostImage>,
    @InjectRepository(PostTag) private readonly postTagRepo: Repository<PostTag>,
    @InjectRepository(PostComment) private readonly postCommentRepo: Repository<PostComment>,

    @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,

    @InjectRepository(CalendarEvent) private readonly calendarEventRepo: Repository<CalendarEvent>,
    @InjectRepository(CalendarEventTag) private readonly calendarEventTagRepo: Repository<CalendarEventTag>,

    @InjectRepository(Assessment) private readonly assessmentRepo: Repository<Assessment>,
    @InjectRepository(AssessmentQuestion) private readonly assessmentQuestionRepo: Repository<AssessmentQuestion>,
    @InjectRepository(AssessmentQuestionPivot) private readonly assessmentQuestionPivotRepo: Repository<AssessmentQuestionPivot>,
    @InjectRepository(AssessmentAnswerOption) private readonly assessmentAnswerOptionRepo: Repository<AssessmentAnswerOption>,
    @InjectRepository(AssessmentRiskSegment) private readonly assessmentRiskSegmentRepo: Repository<AssessmentRiskSegment>,
    @InjectRepository(AssessmentCategory) private readonly assessmentCategoryRepo: Repository<AssessmentCategory>,
  ) { }

  async run() {
    await this.clearDatabase();
    await this.seedDatabase();
  }

  private async clearDatabase() {

    // Limpiar todas las tablas de la base de datos
    console.log('Clearing database');

    await this.assessmentAnswerOptionRepo.delete({});
    await this.assessmentQuestionPivotRepo.delete({});
    await this.assessmentQuestionRepo.delete({});
    await this.assessmentRiskSegmentRepo.delete({});
    await this.assessmentRepo.delete({});
    await this.assessmentCategoryRepo.delete({});

    await this.resourceCommentRepo.delete({});
    await this.postCommentRepo.delete({});
    await this.postTagRepo.delete({});
    await this.deleteS3Images();
    await this.postRepo.delete({});
    await this.calendarEventTagRepo.delete({});
    await this.calendarEventRepo.delete({});
    await this.messageRepo.delete({});
    await this.chatRepo.delete({});

    await this.studentEnrollmentRepo.delete({});
    await this.educatorEnrollmentRepo.delete({});
    await this.studentProgressRepo.delete({});
    await this.educatorProgressRepo.delete({});
    await this.studentsRepo.delete({});
    await this.educatorsRepo.delete({});

    await this.userRepo.delete({});
    await this.institutionsRepo.delete({});
    await this.answerRepo.delete({});
    await this.answerOptionsRepo.delete({});
    await this.questionsRepo.delete({});
    await this.quizRepo.delete({});
    await this.materialsRepo.delete({});
    await this.lessonsRepo.delete({});
    await this.coursesRepo.delete({});
    await this.resourceRepo.delete({});
    await this.resourceAttachmentRepo.delete({});
    await this.tagRepo.delete({});

  }

  private async seedDatabase() {
    await this.dataSource.transaction(async () => {
      await this.seedInstitution();
      console.log('Institution seeded');
      await this.seedUsers();
      console.log('Users seeded');
      await this.seedRandomStudents();
      console.log('Random students seeded');
      await this.seedCourses();
      console.log('Courses seeded');
      await this.seedEnrollments();
      console.log('Enrollments seeded');
      await this.seedStudentProgress();
      console.log('Student progress seeded');
      await this.seedResources();
      console.log('Resources seeded');
      await this.seedTags();
      console.log('Tags seeded');
      await this.seedPosts();
      console.log('Posts seeded');
      await this.seedChatsAndMessages();
      console.log('Chats and messages seeded');
      await this.seedCalendarEvents();
      console.log('Calendar events seeded');
      await this.seedAssessments();
      console.log('Assessments seeded');
    });
  }

  async seedCourses() {
    let courseSequence = 1;
    for (const courseItem of courses) {
      const { id: courseId, title, description, imageUrl, videoUrl, lessons } = courseItem;
      let lessonCount = 0;
      if (lessons) lessonCount = lessons.length;
      let totalDuration = 0;
      for (const lessonItem of lessons) {
        const { materials } = lessonItem;
        if (materials) {
          totalDuration += materials.reduce((acc, material) => acc + (material.duration * 60), 0);
        }
      }
      const course = this.coursesRepo.create({ id: courseId, title, description, imageUrl, videoUrl, sequence: courseSequence, lessonCount, totalDuration });
      await this.coursesRepo.save(course);

      let lessonSequence = 1;
      for (const lessonItem of lessons) {
        const { id: lessonId, title, description, materials } = lessonItem;
        let materialCount = 0;
        if (materials) materialCount = materials.length;
        let totalDuration = 0;
        if (materials) {
          totalDuration = materials.reduce((acc, material) => acc + (material.duration * 60), 0);
        }
        const lesson = this.lessonsRepo.create({ id: lessonId, title, description, sequence: lessonSequence, course: { id: courseId }, materialCount, totalDuration });
        await this.lessonsRepo.save(lesson);

        if (materials) {
          let materialSequence = 1;
          for (const materialItem of materials) {
            const { id: materialId, type, title, url, duration, quiz } = materialItem;
            const material = this.materialsRepo.create({ id: materialId, type: type as MaterialType, title, url, duration: (duration * 60), lesson: { id: lessonId }, sequence: materialSequence });
            await this.materialsRepo.save(material);
            if (type === 'quiz') {
              const { id: quizId, title, description, questions } = quiz;
              const quizItem = this.quizRepo.create({ id: quizId, title, description, material: { id: materialId } });
              await this.quizRepo.save(quizItem);

              let questionSequence = 1;
              for (const questionItem of questions) {
                const { id: questionId, text, type, options } = questionItem;
                const questionType = type as QuestionType;
                const questionEntity = this.questionsRepo.create({ id: questionId, text, type: questionType, quiz: { id: quizId }, sequence: questionSequence });
                await this.questionsRepo.save(questionEntity);

                for (const optionItem of options) {
                  const { id: optionId, option, isCorrect } = optionItem;
                  const answerOption = this.answerOptionsRepo.create({ id: optionId, option, question: { id: questionId } });
                  await this.answerOptionsRepo.save(answerOption);

                  if (isCorrect) {
                    const answer = this.answerRepo.create({ id: randomUUID(), correctAnswerOptionId: optionId, question: { id: questionId } });
                    await this.answerRepo.save(answer);
                  }
                }
                questionSequence++;
              }
            }
            materialSequence++;
          }
        }
        lessonSequence++;
      }
      courseSequence++;
    }
  }

  async seedInstitution() {
    const institution = institutions[0];
    const institutionEntity = this.institutionsRepo.create(institution);
    await this.institutionsRepo.save(institutionEntity);
  }

  async seedUsers() {
    const password = 'Password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const createAndSaveUser = async (
      email: string,
      fullName: string,
      tenantId: string,
      roles: ValidRoles[]
    ) => {
      const user = this.userRepo.create({
        id: randomUUID(),
        email,
        fullName,
        password: hashedPassword,
        tenantId,
        roles
      });
      await this.userRepo.save(user);
      return user;
    };

    const createAndSaveStudent = async (user: any, fullName: string, email: string, whatsappPhone: string, institutionId: string) => {
      const student = this.studentsRepo.create({
        id: randomUUID(),
        fullName,
        profilePicture: faker.image.avatarGitHub(),
        email,
        whatsappPhone,
        user,
        institution: { id: institutionId }
      });
      await this.studentsRepo.save(student);
    };

    const createAndSaveEducator = async (user: any, fullName: string, email: string, whatsappPhone: string, institutionId: string) => {
      const educator = this.educatorsRepo.create({
        id: randomUUID(),
        fullName,
        profilePicture: faker.image.avatarGitHub(),
        email,
        whatsappPhone,
        user,
        institution: { id: institutionId }
      });
      await this.educatorsRepo.save(educator);
    };

    // Admin users
    await Promise.all(
      adminUsers.map(async ({ email, fullName, tenantId, roles }) => {
        await createAndSaveUser(email, fullName, tenantId, roles as ValidRoles[]);
      })
    );

    // Student users
    await Promise.all(
      studentUsers.map(async ({ email, fullName, institutionId, whatsappPhone }) => {
        const user = await createAndSaveUser(email, fullName, institutionId, [ValidRoles.student]);
        await createAndSaveStudent(user, fullName, email, whatsappPhone, institutionId);
      })
    );

    // Educator users
    await Promise.all(
      educatorUsers.map(async ({ email, fullName, institutionId, whatsappPhone }) => {
        const user = await createAndSaveUser(email, fullName, institutionId, [ValidRoles.educator]);
        await createAndSaveEducator(user, fullName, email, whatsappPhone, institutionId);
      })
    );

    // Additional random educators
    const institutionId = institutions[0]?.id;
    if (institutionId) {
      await Promise.all(
        Array.from({ length: 10 }).map(async () => {
          const fullName = faker.person.fullName();
          const [firstName = '', lastName = ''] = fullName.split(' ');
          const email = faker.internet.email({ firstName, lastName });
          const whatsappPhone = faker.phone.number({ style: 'international' });

          const user = await createAndSaveUser(email, fullName, institutionId, [ValidRoles.educator]);
          await createAndSaveEducator(user, fullName, email, whatsappPhone, institutionId);
        })
      );
    }
  }

  async seedEnrollments() {
    const courses = await this.coursesRepo.find();
    const students = await this.studentsRepo.find();
    const educators = await this.educatorsRepo.find();

    const enrollmentsPromises = students.map(async (student) => {
      const enrollments = courses.map(course => {
        return this.studentEnrollmentRepo.create({ id: randomUUID(), course, student });
      });
      await this.studentEnrollmentRepo.save(enrollments);
    });
    await Promise.all(enrollmentsPromises);

    const educatorEnrollmentsPromises = educators.map(async (educator) => {
      const enrollments = courses.map(course => {
        return this.educatorEnrollmentRepo.create({ id: randomUUID(), course, educator });
      });
      await this.educatorEnrollmentRepo.save(enrollments);
    });
    await Promise.all(educatorEnrollmentsPromises);
  }

  async seedStudentProgress() {
    // Find the GO Programming Course
    const goCourse = await this.coursesRepo.findOne({
      where: { title: 'GO Programming Course' },
      relations: ['lessons', 'lessons.materials']
    });

    if (!goCourse) {
      console.error('GO Programming Course not found');
      return;
    }

    // Get all materials from the course, ordered by lesson sequence and material sequence
    const allMaterials = [];
    goCourse.lessons
      .sort((a, b) => a.sequence - b.sequence)
      .forEach(lesson => {
        lesson.materials
          .sort((a, b) => a.sequence - b.sequence)
          .forEach(material => {
            allMaterials.push(material);
          });
      });

    // Get all students
    const students = await this.studentsRepo.find();

    for (const student of students) {
      // Random number of materials to complete (but always in order)
      const materialsToComplete = faker.number.int({ min: 1, max: allMaterials.length });
      
      // Create progress for each material in sequence
      for (let i = 0; i < materialsToComplete; i++) {
        const material = allMaterials[i];
        
        let lastPosition = 0;
        let progressPercentage = 100; // Always complete the material
        let score = null;

        if (material.type === 'video') {
          // For videos: set lastPosition to the full duration (in seconds)
          lastPosition = material.duration; // duration is already in seconds from seed
          progressPercentage = 100;
        } else if (material.type === 'quiz') {
          // For quizzes: set a random score between 60-100
          score = faker.number.int({ min: 60, max: 100 });
          progressPercentage = 100;
        }

        const studentProgress = this.studentProgressRepo.create({
          id: randomUUID(),
          student: { id: student.id },
          material: { id: material.id },
          lastPosition,
          progressPercentage,
          score
        });

        await this.studentProgressRepo.save(studentProgress);
      }

      // Update student enrollment progress
      await this.updateStudentEnrollmentProgress(student.id, goCourse.id, materialsToComplete, allMaterials.length);
    }
  }

  private async updateStudentEnrollmentProgress(studentId: string, courseId: string, completedMaterials: number, totalMaterials: number) {
    const enrollment = await this.studentEnrollmentRepo.findOne({
      where: { student: { id: studentId }, course: { id: courseId } }
    });

    if (!enrollment) {
      console.error(`Enrollment not found for student ${studentId} and course ${courseId}`);
      return;
    }

    const progressPercentage = (completedMaterials / totalMaterials) * 100;
    let completedAt = null;

    // If course is 100% complete, set completion date within last 5 days
    if (progressPercentage === 100) {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      completedAt = faker.date.between({ from: fiveDaysAgo, to: new Date() });
    }

    await this.studentEnrollmentRepo.update(
      { id: enrollment.id },
      {
        totalCompleted: completedMaterials,
        progressPercentage,
        completedAt
      }
    );
  }

  async seedResources() {
    const educatorsIds = await this.educatorsRepo.find().then(educators => educators.map(educator => educator.id));
    const types: ResourceType[] = Object.values(ResourceType);
    const statuses: ResourceStatus[] = [ResourceStatus.PUBLISHED, ResourceStatus.PUBLISHED, ResourceStatus.PUBLISHED, ResourceStatus.DRAFT, ResourceStatus.ARCHIVED];
    const resources = [];
    const resourceAttachments = [];
    const resourceComments = [];

    for (let i = 0; i < 50; i++) {

      // RESOURCES
      const resourceType = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const resourceCreationDate = faker.date.between({ from: '2025-02-01', to: Date.now() });

      const paragraphsCount = resourceType === ResourceType.VIDEO ? faker.number.int({ min: 1, max: 3 }) : faker.number.int({ min: 3, max: 5 });

      const paragraphs = Array.from({ length: paragraphsCount }, () =>
        faker.lorem.paragraphs(faker.number.int({ min: 3, max: 10 }), '\n')
      );

      const resource = this.resourceRepo.create({
        id: randomUUID(),
        status,
        resourceType,
        thumbnailUrl: faker.image.urlPicsumPhotos({ width: 300, height: 200, blur: 1 }),
        title: faker.lorem.sentence(),
        extract: faker.lorem.paragraph(),
        contentUrl: resourceType === ResourceType.VIDEO ? "https://www.youtube.com/watch?v=GmW1-60Wdfo" : faker.image.urlPicsumPhotos({ width: 1920, height: 1080, blur: 1 }),
        paragraphs,
        minsDuration: Math.floor(Math.random() * 60),
        views: Math.floor(Math.random() * 10),
        sequence: i + 1,
        creation_date: resourceCreationDate,
        update_date: resourceCreationDate,
      });
      resources.push(resource);


      // RESOURCE ATTACHMENTS
      for (let i = 0; i < faker.number.int({ min: 0, max: 5 }); i++) {
        const attachmentCreationDate = faker.date.between({ from: resourceCreationDate, to: Date.now() });
        const attachment = this.resourceAttachmentRepo.create({
          id: randomUUID(),
          mimetype: faker.helpers.arrayElement(['image/jpeg', 'image/png', 'application/pdf']),
          name: faker.lorem.sentence(),
          url: faker.internet.url(),
          resource: { id: resource.id },
          downloads: faker.number.int({ min: 0, max: 15 }),
          creation_date: attachmentCreationDate,
          update_date: attachmentCreationDate,
        });
        resourceAttachments.push(attachment);
      }

      // RESOURCE COMMENTS
      for (let i = 0; i < faker.number.int({ min: 0, max: 30 }); i++) {
        const commentCreationDate = faker.date.between({ from: resourceCreationDate, to: Date.now() });
        const comment = this.resourceCommentRepo.create({
          id: randomUUID(),
          comment: faker.lorem.paragraph({ min: 1, max: 3 }),
          resource: { id: resource.id },
          educator: { id: faker.helpers.arrayElement(educatorsIds) },
          creation_date: commentCreationDate,
          update_date: commentCreationDate,
        });
        resourceComments.push(comment);
      }

    }

    await this.resourceRepo.save(resources);
    await this.resourceAttachmentRepo.save(resourceAttachments);
    await this.resourceCommentRepo.save(resourceComments);

  }

  async seedTags() {

    // Limpiar la tabla de etiquetas
    await this.tagRepo.delete({});

    const tagNames = [
      'Bullying',
      'Racism',
      'Inclusion',
      'Diversity',
      'School-Harassment',
      'Empathy',
      'Coexistence',
      'Respect',
      'Equality',
      'Human-Rights',
    ];

    const tags = [];

    for (const name of tagNames) {
      tags.push({ id: randomUUID(), name: name.toLowerCase() });
    }

    await this.tagRepo.save(tags);
  }

  async deleteS3Images() {
    const imagesUrls = await this.postImageRepo.find();
    for (const image of imagesUrls) {
      await this.s3Service.deleteFile(image.imageKey);
    }
    // Eliminar imagenes de la base de datos
    await this.postImageRepo.delete({});
  }

  async seedPosts() {
    const educatorIds = await this.educatorsRepo.find().then(educators => educators.map(educator => educator.id));
    const tags = await this.tagRepo.find();

    // Eliminar imagenes de S3
    const imagesUrls = await this.postImageRepo.find();
    for (const image of imagesUrls) {
      await this.s3Service.deleteFile(image.imageKey);
    }

    for (let i = 0; i < 30; i++) {
      // 1. Crear el post
      const postCreationDate = faker.date.between({ from: '2025-02-01', to: Date.now() });
      const post = this.postRepo.create({
        id: randomUUID(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        educator: { id: faker.helpers.arrayElement(educatorIds) },
        views: faker.number.int({ min: 0, max: 100 }),
        replies: 0,
        creation_date: postCreationDate,
      });
      await this.postRepo.save(post);

      // 2. Asociar etiquetas aleatorias
      const randomTags = faker.helpers.arrayElements(tags, { min: 1, max: 3 });
      const postTags = randomTags.map(tag => ({ id: randomUUID(), post, tag }));
      await this.postTagRepo.save(postTags);

      // 3. Cargar imágenes desde carpeta local
      const imagesDir = path.join(process.cwd(), 'src', 'seed', 'images');

      const allImageFiles = fs.readdirSync(imagesDir).filter(file => {
        const fullPath = path.join(imagesDir, file);
        return fs.statSync(fullPath).isFile(); // Solo archivos, no directorios
      });

      const imageCount = faker.number.int({ min: 0, max: 4 });
      const selectedImages = faker.helpers.arrayElements(allImageFiles, imageCount);

      // 4. Subir imágenes y guardarlas en la base de datos
      for (const imageFile of selectedImages) {
        const buffer = fs.readFileSync(path.join(imagesDir, imageFile));

        const file = {
          buffer,
          originalname: imageFile,
          mimetype: 'image/jpeg', // o deducí el mimetype con mime-types si tenés distintos formatos
        } as Express.Multer.File;

        const uploadResult = await this.s3Service.uploadImage(file, 'posts');

        const postImage = this.postImageRepo.create({
          post: post,
          imageKey: uploadResult.key,
          originalName: imageFile,
          slug: SlugAdapter.generate(imageFile),
          size: buffer.length,
          mimeType: 'image/webp',
        });

        await this.postImageRepo.save(postImage);
      }

      // 5. Crear comentarios aleatorios
      const commentCount = faker.number.int({ min: 0, max: 10 });
      for (let j = 0; j < commentCount; j++) {
        const commentCreationDate = faker.date.between({ from: postCreationDate, to: Date.now() });
        const comment = this.postCommentRepo.create({
          id: randomUUID(),
          comment: faker.lorem.paragraph({ min: 1, max: 3 }),
          post: { id: post.id },
          educator: { id: faker.helpers.arrayElement(educatorIds) },
          creation_date: commentCreationDate,
          update_date: commentCreationDate,
        });
        await this.postCommentRepo.save(comment);
      }

      // Actualizar el contador de respuestas del post
      const repliesCount = await this.postCommentRepo.count({ where: { post: { id: post.id } } });
      await this.postRepo.update({ id: post.id }, { replies: repliesCount });


    }

    // Actualizar totalPosts de los educadores
    const educators = await this.educatorsRepo.find();
    for (const educator of educators) {
      const totalPosts = await this.postRepo.count({ where: { educator: { id: educator.id } } });
      await this.educatorsRepo.update({ id: educator.id }, { totalPosts });
    }
  }

  async seedChatsAndMessages() {
    const educators = await this.educatorsRepo.find();
    const educatorIds = educators.map((e) => e.id);
    const institutionId = institutions[0]?.id;

    if (!institutionId) {
      console.error('Institution ID not found');
      return;
    }

    const createdPairs = new Set<string>();

    // Intentamos crear hasta un máximo de N chats (evitando todos con todos)
    const maxChats = Math.min(educatorIds.length * 2, 20);

    for (let chatCount = 0; chatCount < maxChats; chatCount++) {
      const [id1, id2] = faker.helpers.arrayElements(educatorIds, 2);
      const pairKey = [id1, id2].sort().join('-');
      if (createdPairs.has(pairKey)) continue;
      createdPairs.add(pairKey);

      const chat = this.chatRepo.create({
        id: randomUUID(),
        educatorOne: { id: id1 },
        educatorTwo: { id: id2 },
        institution: { id: institutionId },
      });
      await this.chatRepo.save(chat);

      const blocksCount = faker.number.int({ min: 2, max: 6 });

      for (let b = 0; b < blocksCount; b++) {
        const blockDate = faker.date.between({ from: '2025-02-01', to: Date.now() });
        const messagesInBlock = faker.number.int({ min: 5, max: 25 });

        for (let m = 0; m < messagesInBlock; m++) {
          const timeOffset = faker.number.int({ min: 0, max: 60 * 60 * 1000 }); // Hasta 1h entre mensajes
          const timestamp = new Date(blockDate.getTime() + timeOffset);

          const senderId = faker.helpers.arrayElement([id1, id2]);
          const receiverId = senderId === id1 ? id2 : id1;

          const message = this.messageRepo.create({
            id: randomUUID(),
            content: faker.lorem.sentence(),
            chat,
            sender: { id: senderId },
            receiver: { id: receiverId },
            read: false,
            creation_date: timestamp,
            update_date: timestamp,
          });

          await this.messageRepo.save(message);
        }
      }
    }
  }

  async seedCalendarEvents() {
    // Eliminar imágenes de S3 (deleteCalendarEventsImages)
    await this.deleteCalendarEventsImages();

    const educators = await this.educatorsRepo.find({ relations: { institution: true, user: true } });
    const tags = await this.tagRepo.find();

    // 3. Cargar imágenes desde carpeta local
    const imagesDir = path.join(process.cwd(), 'src', 'seed', 'images', 'banners');
    const allImageFiles = fs.readdirSync(imagesDir);

    for (const educator of educators) {
      // 80% de probabilidad de que este educator genere eventos
      if (Math.random() > 0.7) continue;

      const eventCount = faker.number.int({ min: 0, max: 3 });

      for (let i = 0; i < eventCount; i++) {
        const start = faker.date.between({ from: '2025-05-01', to: faker.date.soon({ days: 60 }) });

        // Agregar una hora aleatoria del día (por ejemplo entre 8:00 y 18:00)
        const randomHour = faker.number.int({ min: 8, max: 18 });
        start.setHours(randomHour);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);

        const durationHours = faker.number.int({ min: 1, max: 3 });
        const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

        let uploadResult = null;
        if (Math.random() > 0.5) {
          const imageFile = faker.helpers.arrayElement(allImageFiles);
          const buffer = fs.readFileSync(path.join(imagesDir, imageFile));
          const file = { buffer, originalname: imageFile, mimetype: 'image/jpeg' } as Express.Multer.File;
          uploadResult = await this.s3Service.uploadImage(file, 'calendar-events');
        }

        const event = this.calendarEventRepo.create({
          id: randomUUID(),
          type: 'institution',
          title: faker.lorem.words(4),
          description: faker.lorem.sentence({ min: 10, max: 30 }),
          bannerUrl: uploadResult ? uploadResult.key : null,
          eventUrl: Math.random() > 0.6 ? faker.internet.url() : null,
          startDate: start,
          endDate: end,
          user: { id: educator.user.id },
          institution: educator.institution
        });

        await this.calendarEventRepo.save(event);

        // 2. Asociar etiquetas aleatorias
        const randomTags = faker.helpers.arrayElements(tags, { min: 1, max: 3 });
        const postTags = randomTags.map(tag => ({ id: randomUUID(), tag, calendarEvent: event }));
        await this.calendarEventTagRepo.save(postTags);
      }
    }

    const usersWithAdmin = await this.userRepo.find({
      where: {
        roles: Raw((alias) => `'admin' = ANY(${alias})`),
      },
    });

    for (const admin of usersWithAdmin) {
      const eventCount = faker.number.int({ min: 5, max: 15 });

      for (let i = 0; i < eventCount; i++) {
        const start = faker.date.between({ from: '2025-05-01', to: faker.date.soon({ days: 60 }) });

        // Agregar una hora aleatoria del día (por ejemplo entre 8:00 y 18:00)
        const randomHour = faker.number.int({ min: 8, max: 18 });
        start.setHours(randomHour);
        start.setMinutes(0);
        start.setSeconds(0);

        start.setMilliseconds(0);

        const durationHours = faker.number.int({ min: 1, max: 3 });
        const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

        let uploadResult = null;
        if (Math.random() > 0.5) {
          const imageFile = faker.helpers.arrayElement(allImageFiles);
          const buffer = fs.readFileSync(path.join(imagesDir, imageFile));
          const file = { buffer, originalname: imageFile, mimetype: 'image/jpeg' } as Express.Multer.File;
          uploadResult = await this.s3Service.uploadImage(file, 'calendar-events');
        }

        const event = this.calendarEventRepo.create({
          id: randomUUID(),
          type: 'global',
          title: faker.lorem.words(4),
          description: faker.lorem.sentence({ min: 10, max: 30 }),
          bannerUrl: uploadResult ? uploadResult.key : null,
          eventUrl: Math.random() > 0.6 ? faker.internet.url() : null,
          startDate: start,
          endDate: end,
          user: { id: admin.id },
          institution: null
        });

        await this.calendarEventRepo.save(event);

        // 2. Asociar etiquetas aleatorias
        const randomTags = faker.helpers.arrayElements(tags, { min: 1, max: 3 });
        const postTags = randomTags.map(tag => ({ id: randomUUID(), tag, calendarEvent: event }));
        await this.calendarEventTagRepo.save(postTags);
      }
    }

  }

  async deleteCalendarEventsImages() {
    const calendarEvents = await this.calendarEventRepo.find({ where: { bannerUrl: Not(IsNull()) } });
    for (const event of calendarEvents) {
      if (event.bannerUrl) {
        await this.s3Service.deleteFile(event.bannerUrl);
      }
    }
    // Eliminar las URLs de las imágenes de los eventos
    await this.calendarEventRepo.update({}, { bannerUrl: null });
  }

  async seedAssessments() {

    try {
      // Delete all files from S3
      const assessmentQuestions = await this.assessmentQuestionRepo.find({ where: { questionImage: Not(IsNull()) } });
      for (const question of assessmentQuestions) {
        if (question.questionImage) {
          await this.s3Service.deleteFile(question.questionImage);
        }
      }

      const categoriesNames = ["Depression", "Anxiety", "Stress", "Self-esteem", "Self-care", "Self-awareness", "Self-regulation", "Social-skills", "Problem-solving", "Decision-making"];
      for (const name of categoriesNames) {
        const category = this.assessmentCategoryRepo.create({
          id: randomUUID(),
          name: name,
        });
        await this.assessmentCategoryRepo.save(category);
      }
      const categoriesDB = await this.assessmentCategoryRepo.find();

      // Cargar imágenes desde carpeta local para las preguntas
      const imagesDir = path.join(process.cwd(), 'src', 'seed', 'images');
      const allImageFiles = fs.readdirSync(imagesDir).filter(file => {
        const fullPath = path.join(imagesDir, file);
        return fs.statSync(fullPath).isFile(); // Solo archivos, no directorios
      });

      // PREGUNTAS Y RESPUESTAS
      for (let i = 0; i < 50; i++) {
        const question = this.assessmentQuestionRepo.create({
          id: randomUUID(),
          questionText: faker.lorem.sentence().replace('.', '?'),
          maxScore: 0
        });

        const randomCountOfAnswers = faker.number.int({ min: 2, max: 5 });
        await this.assessmentQuestionRepo.save(question);

        // Subir imagen para preguntas pares (índice par)
        if (i % 2 === 0 && allImageFiles.length > 0) {
          const imageFile = faker.helpers.arrayElement(allImageFiles);
          const buffer = fs.readFileSync(path.join(imagesDir, imageFile));

          const file = {
            buffer,
            originalname: imageFile,
            mimetype: 'image/jpeg',
          } as Express.Multer.File;

          const uploadResult = await this.s3Service.uploadImage(file, 'assessment-questions');

          // Actualizar la pregunta con la imagen
          await this.assessmentQuestionRepo.update({ id: question.id }, { questionImage: uploadResult.key });
        }

        for (let j = 0; j < randomCountOfAnswers; j++) {
          const answer = this.assessmentAnswerOptionRepo.create({
            id: randomUUID(),
            answerText: faker.lorem.sentence(),
            score: 10 * j,
            id_assessment_question: question.id
          });
          await this.assessmentAnswerOptionRepo.save(answer);
        }

        // Update question maxScore (max of answers)
        const maxScore = 10 * (randomCountOfAnswers - 1);
        await this.assessmentQuestionRepo.update({ id: question.id }, { maxScore });
      }
      const questionsDB = await this.assessmentQuestionRepo.find();

      for (let i = 0; i < 15; i++) {
        const randomCategory = faker.helpers.arrayElement(categoriesDB);
        const randomDate = faker.date.between({ from: '2025-01-01', to: '2025-06-30' });
        const assessment = this.assessmentRepo.create({
          id: randomUUID(),
          title: faker.lorem.sentence(),
          description: faker.lorem.sentences(3),
          assessmentCategory: { id: randomCategory.id },
          attempts: faker.number.int({ min: 5, max: 100 }),
          isActive: faker.datatype.boolean(),
          creation_date: randomDate,
          update_date: randomDate,
        });
        await this.assessmentRepo.save(assessment);

        const randomCountOfQuestions = faker.number.int({ min: 3, max: 8 });
        const randomQuestions = faker.helpers.arrayElements(questionsDB, randomCountOfQuestions);
        for (let i = 0; i < randomCountOfQuestions; i++) {
          const question = randomQuestions[i];
          const pivot = this.assessmentQuestionPivotRepo.create({
            id: randomUUID(),
            id_assessment: assessment.id,
            id_assessment_question: question.id,
            order: i
          });
          await this.assessmentQuestionPivotRepo.save(pivot);
        }

        // SUM OF SCORES OF QUESTIONS OF ASSESSMENT
        const sumOfScores = randomQuestions.reduce((acc, question) => acc + question.maxScore, 0);

        // RISK SEGMENTS
        const randomCountOfRiskSegments = faker.number.int({ min: 2, max: 5 });
        const segmentSize = Math.ceil(sumOfScores / randomCountOfRiskSegments);
        const riskSegments = [];

        for (let j = 0; j < randomCountOfRiskSegments; j++) {
          const minScore = j * segmentSize;
          // Aseguramos que el último segmento llegue exactamente a maxScore
          const segmentMaxScore =
            j === randomCountOfRiskSegments - 1 ? sumOfScores : (j + 1) * segmentSize;

          riskSegments.push({
            id: randomUUID(),
            minScore,
            maxScore: segmentMaxScore,
            recommendations: faker.lorem.sentence(),
            assessment: { id: assessment.id }
          });
        }

        await this.assessmentRiskSegmentRepo.save(riskSegments);

        // Update assessment maxScore (sum of scores of questions)
        await this.assessmentRepo.update({ id: assessment.id }, { maxScore: sumOfScores });

      }
      await this.seedSingleAssessment();
      await this.seedSingleAssessmentConflictResponse();
      await this.seedSingleAssessmentSocialSafety();

    } catch (error) {
      console.log(error);
    }
  }

  async seedSingleAssessment() {
    try {
      const category = this.assessmentCategoryRepo.create({
        id: randomUUID(),
        name: 'Social Vulnerability',
      });
      await this.assessmentCategoryRepo.save(category);

      const assessment = this.assessmentRepo.create({
        id: randomUUID(),
        title: 'Bullying Awareness and Support Assessment',
        description: 'A set of questions designed to detect signs of vulnerability to bullying, racism, or exclusion in school environments.',
        assessmentCategory: { id: category.id },
        isActive: true,
        creation_date: new Date(),
        update_date: new Date(),
      });
      await this.assessmentRepo.save(assessment);

      const questionTexts = [
        'Have you ever felt left out or ignored by your classmates?',
        'Has anyone at school called you names or made fun of you?',
        'Do you feel safe when walking around your school?',
        'Has someone ever spread rumors about you?',
        'Do you know who to talk to if someone is bothering you?',
        'Have you witnessed bullying happening to someone else?',
        'Do you feel anxious or afraid to go to school?',
        'Have you been physically hurt or threatened at school?',
        'Do you think your teachers care about how you feel?',
        'Have you ever wanted to stay home to avoid someone at school?'
      ];

      const questions = [];
      for (const text of questionTexts) {
        const q = this.assessmentQuestionRepo.create({
          id: randomUUID(),
          questionText: text,
          maxScore: 15,
        });
        await this.assessmentQuestionRepo.save(q);
        questions.push(q);

        const answers = [
          { text: 'Never', score: 0 },
          { text: 'Sometimes', score: 5 },
          { text: 'Often', score: 10 },
          { text: 'Always', score: 15 },
        ];

        for (const ans of answers) {
          const answer = this.assessmentAnswerOptionRepo.create({
            id: randomUUID(),
            answerText: ans.text,
            score: ans.score,
            id_assessment_question: q.id,
          });
          await this.assessmentAnswerOptionRepo.save(answer);
        }

        const pivot = this.assessmentQuestionPivotRepo.create({
          id: randomUUID(),
          id_assessment: assessment.id,
          id_assessment_question: q.id,
          order: questions.length - 1,
        });
        await this.assessmentQuestionPivotRepo.save(pivot);
      }

      const sumOfScores = questions.reduce((sum, q) => sum + q.maxScore, 0);

      const segments = [
        { min: 0, max: 50, level: 'low', rec: 'Everything seems fine. Keep fostering a respectful environment.' },
        { min: 51, max: 100, level: 'medium', rec: 'Consider speaking with a friend or teacher about your feelings.' },
        { min: 101, max: 150, level: 'high', rec: 'Talk to your teacher or school counselor about your experiences.' },
        { min: 151, max: 200, level: 'high', rec: 'Tell a school authority and your parents immediately. You\'re not alone.' },
      ];

      for (const seg of segments) {
        const segment = this.assessmentRiskSegmentRepo.create({
          id: randomUUID(),
          minScore: seg.min,
          maxScore: seg.max,
          recommendations: seg.rec,
          assessment: { id: assessment.id },
        });
        await this.assessmentRiskSegmentRepo.save(segment);
      }

      await this.assessmentRepo.update({ id: assessment.id }, { maxScore: sumOfScores });
    } catch (error) {
      console.log(error);
    }
  }

  async seedSingleAssessmentConflictResponse() {
    try {
      const category = this.assessmentCategoryRepo.create({
        id: randomUUID(),
        name: 'Conflict Response and Social Awareness',
      });
      await this.assessmentCategoryRepo.save(category);

      const assessment = this.assessmentRepo.create({
        id: randomUUID(),
        title: 'Response to Social Conflict Situations',
        description: 'An assessment designed to evaluate how students would react in situations involving bullying, exclusion, or discrimination.',
        assessmentCategory: { id: category.id },
        isActive: true,
        creation_date: new Date(),
        update_date: new Date(),
      });
      await this.assessmentRepo.save(assessment);

      const questionsData = [
        {
          text: 'What would you do if you saw someone being bullied at school?',
          answers: [
            { text: 'Ignore it and walk away', score: 0 },
            { text: 'Tell a friend but not a teacher', score: 5 },
            { text: 'Talk to the person later to see if they are okay', score: 10 },
            { text: 'Report it to a teacher or school counselor', score: 15 }
          ]
        },
        {
          text: 'What would you do if a classmate made a racist joke?',
          answers: [
            { text: 'Laugh to fit in', score: 0 },
            { text: 'Say it made you uncomfortable', score: 10 },
            { text: 'Talk to them privately about why it\'s wrong', score: 15 },
            { text: 'Tell a teacher immediately', score: 12 }
          ]
        },
        {
          text: 'What would you do if a friend told you they were being bullied?',
          answers: [
            { text: 'Tell them to ignore it', score: 0 },
            { text: 'Encourage them to talk to a teacher', score: 10 },
            { text: 'Offer to go with them to report it', score: 15 },
            { text: 'Post about it on social media', score: 3 }
          ]
        },
        {
          text: 'If someone is always alone during recess, what would you do?',
          answers: [
            { text: 'Do nothing', score: 0 },
            { text: 'Talk to them and invite them to play', score: 15 },
            { text: 'Tell a teacher they look sad', score: 10 },
            { text: 'Laugh with your friends about it', score: 0 }
          ]
        },
        {
          text: 'What would you do if a group excludes another student because of their background?',
          answers: [
            { text: 'Join the group to not be left out', score: 0 },
            { text: 'Talk to the excluded student', score: 10 },
            { text: 'Help include them in your group', score: 15 },
            { text: 'Tell a responsible adult', score: 12 }
          ]
        }
      ];

      const questions = [];

      for (let i = 0; i < questionsData.length; i++) {
        const q = questionsData[i];
        const question = this.assessmentQuestionRepo.create({
          id: randomUUID(),
          questionText: q.text,
          maxScore: Math.max(...q.answers.map((a) => a.score)),
        });
        await this.assessmentQuestionRepo.save(question);
        questions.push(question);

        for (const a of q.answers) {
          const answer = this.assessmentAnswerOptionRepo.create({
            id: randomUUID(),
            answerText: a.text,
            score: a.score,
            id_assessment_question: question.id,
          });
          await this.assessmentAnswerOptionRepo.save(answer);
        }

        const pivot = this.assessmentQuestionPivotRepo.create({
          id: randomUUID(),
          id_assessment: assessment.id,
          id_assessment_question: question.id,
          order: i,
        });
        await this.assessmentQuestionPivotRepo.save(pivot);
      }

      const segments = [
        {
          minScore: 0,
          maxScore: 25,
          riskLevel: 'low',
          recommendations: 'You might need more guidance on how to respond to challenging social situations.'
        },
        {
          minScore: 26,
          maxScore: 50,
          riskLevel: 'medium',
          recommendations: 'You\'re on the right track. Consider discussing more strategies with a counselor or teacher.'
        },
        {
          minScore: 51,
          maxScore: 75,
          riskLevel: 'high',
          recommendations: 'You are showing strong social awareness and empathy. Keep being a positive influence.'
        }
      ];

      for (const seg of segments) {
        const risk = this.assessmentRiskSegmentRepo.create({
          id: randomUUID(),
          minScore: seg.minScore,
          maxScore: seg.maxScore,
          recommendations: seg.recommendations,
          assessment: { id: assessment.id },
        });
        await this.assessmentRiskSegmentRepo.save(risk);
      }

      const totalScore = questions.reduce((acc, q) => acc + q.maxScore, 0);
      await this.assessmentRepo.update({ id: assessment.id }, { maxScore: totalScore });
    } catch (error) {
      console.log(error);
    }
  }

  async seedSingleAssessmentSocialSafety() {
    try {
      const category = this.assessmentCategoryRepo.create({
        id: randomUUID(),
        name: 'Social Safety and Empowerment',
      });
      await this.assessmentCategoryRepo.save(category);

      const assessment = this.assessmentRepo.create({
        id: randomUUID(),
        title: 'Social Safety and Empowerment Assessment',
        description: 'This assessment evaluates students\' responses to scenarios involving bullying, exclusion, racism, and online threats. It promotes awareness, empathy, and positive social actions in complex situations.',
        assessmentCategory: { id: category.id },
        isActive: true,
        creation_date: new Date(),
        update_date: new Date(),
      });
      await this.assessmentRepo.save(assessment);

      const questionsData = [
        {
          text: 'What would you do if you see someone being laughed at because of their clothing or accent?',
          answers: [
            { text: 'Join in the laughter to avoid being excluded', score: 0 },
            { text: 'Feel bad but stay quiet', score: 5 },
            { text: 'Approach them later to offer support', score: 10 },
            { text: 'Speak up or tell the group it’s wrong', score: 15 }
          ]
        },
        {
          text: 'What would you do if someone sent you a private message making fun of another classmate?',
          answers: [
            { text: 'Forward it to others', score: 0 },
            { text: 'Ignore the message', score: 5 },
            { text: 'Ask the sender not to share such messages', score: 10 },
            { text: 'Report the message to a trusted adult', score: 15 }
          ]
        },
        {
          text: 'If you saw someone being excluded from group work repeatedly, how would you react?',
          answers: [
            { text: 'Do nothing, it’s not your problem', score: 0 },
            { text: 'Invite the excluded person to your group', score: 15 },
            { text: 'Tell a teacher about the repeated behavior', score: 10 },
            { text: 'Talk to the other students about including them', score: 12 }
          ]
        },
        {
          text: 'If you felt unsafe due to someone’s behavior at school, what would you do?',
          answers: [
            { text: 'Keep it to yourself and avoid the person', score: 5 },
            { text: 'Tell a close friend only', score: 7 },
            { text: 'Talk to a teacher or school counselor', score: 15 },
            { text: 'Tell your parents and school authorities', score: 15 }
          ]
        },
        {
          text: 'What would you do if a classmate was being cyberbullied?',
          answers: [
            { text: 'Ignore it', score: 0 },
            { text: 'Tell them to block the bully', score: 5 },
            { text: 'Offer emotional support and suggest reporting it', score: 10 },
            { text: 'Help them report the incident to adults', score: 15 }
          ]
        },
        {
          text: 'What would you do if someone called you offensive names online?',
          answers: [
            { text: 'Insult them back', score: 0 },
            { text: 'Block them and move on', score: 8 },
            { text: 'Report them to the platform or school', score: 15 },
            { text: 'Screenshot and talk to an adult', score: 15 }
          ]
        },
      ];

      const questions = [];

      for (let i = 0; i < questionsData.length; i++) {
        const q = questionsData[i];
        const question = this.assessmentQuestionRepo.create({
          id: randomUUID(),
          questionText: q.text,
          maxScore: Math.max(...q.answers.map((a) => a.score)),
        });
        await this.assessmentQuestionRepo.save(question);
        questions.push(question);

        for (const a of q.answers) {
          const answer = this.assessmentAnswerOptionRepo.create({
            id: randomUUID(),
            answerText: a.text,
            score: a.score,
            id_assessment_question: question.id,
          });
          await this.assessmentAnswerOptionRepo.save(answer);
        }

        const pivot = this.assessmentQuestionPivotRepo.create({
          id: randomUUID(),
          id_assessment: assessment.id,
          id_assessment_question: question.id,
          order: i,
        });
        await this.assessmentQuestionPivotRepo.save(pivot);
      }

      const segments = [
        {
          minScore: 0,
          maxScore: 30,
          riskLevel: 'low',
          recommendations: 'Consider learning more about empathy and safe responses to bullying and exclusion.',
        },
        {
          minScore: 31,
          maxScore: 60,
          riskLevel: 'medium',
          recommendations: 'You show awareness. Try to be more proactive in defending others and reporting abuse.',
        },
        {
          minScore: 61,
          maxScore: 90,
          riskLevel: 'high',
          recommendations: 'Excellent! You are well-prepared to respond to social threats and support your peers.',
        }
      ];

      for (const seg of segments) {
        const risk = this.assessmentRiskSegmentRepo.create({
          id: randomUUID(),
          minScore: seg.minScore,
          maxScore: seg.maxScore,
          recommendations: seg.recommendations,
          assessment: { id: assessment.id },
        });
        await this.assessmentRiskSegmentRepo.save(risk);
      }

      const totalScore = questions.reduce((acc, q) => acc + q.maxScore, 0);
      await this.assessmentRepo.update({ id: assessment.id }, { maxScore: totalScore });
    } catch (error) {
      console.log(error);
    }
  }

  async seedRandomStudents() {
    const institutionId = institutions[0]?.id;
    if (!institutionId) {
      console.error('Institution ID not found for random students');
      return;
    }

    const password = 'Password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const numberOfStudents = 30; // Number of random students to create

    for (let i = 0; i < numberOfStudents; i++) {
      // Generate random student data
      const fullName = faker.person.fullName();
      const [firstName = '', lastName = ''] = fullName.split(' ');
      const email = faker.internet.email({ firstName, lastName });
      const whatsappPhone = faker.phone.number({ style: 'international' });

      // Create user first
      const user = this.userRepo.create({
        id: randomUUID(),
        email,
        fullName,
        password: hashedPassword,
        tenantId: institutionId,
        roles: [ValidRoles.student]
      });
      await this.userRepo.save(user);

      // Create student
      const student = this.studentsRepo.create({
        id: randomUUID(),
        fullName,
        profilePicture: faker.image.avatarGitHub(),
        email,
        whatsappPhone,
        user,
        institution: { id: institutionId }
      });
      await this.studentsRepo.save(student);

    }
  }

}
