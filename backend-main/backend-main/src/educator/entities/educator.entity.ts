import { Entity, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntityUUID, User, Institution, EducatorEnrollment, Post } from 'src/exports/entities';
import { EducatorProgress } from 'src/progress/entities';
import { ResourceComment } from 'src/resources/entities';
import { PostComment } from 'src/post/entities';

@Entity()
export class Educator extends AbstractEntityUUID {

    @Column({ type: 'varchar', length: 255, nullable: true })
    profilePicture: string;

    @Column({ type: 'varchar', length: 100 })
    fullName: string;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'varchar', length: 100 })
    whatsappPhone: string;

    @Column({ type: 'int', nullable: false, default: 0 })
    totalPosts: number;

    @ManyToOne(() => Institution, (institution) => institution.educators)
    institution: Institution;

    @OneToOne(() => User, (user) => user.educator)
    @JoinColumn()
    user: User;

    @OneToMany(() => ResourceComment, (comment) => comment.educator, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    comments: ResourceComment[];

    @OneToMany(() => EducatorProgress, (educatorProgress) => educatorProgress.educator)
    educatorProgress: EducatorProgress[];

    @OneToMany(() => EducatorEnrollment, (educatorEnrollment) => educatorEnrollment.educator)
    educatorEnrollments: EducatorEnrollment[];

    @OneToMany(() => Post, (post) => post.educator)
    posts: Post[];

    @OneToMany(() => PostComment, (postComment) => postComment.educator, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    postComments: PostComment[];
}
