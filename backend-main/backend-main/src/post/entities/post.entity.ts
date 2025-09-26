import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntityUUID, Educator } from 'src/exports/entities';
import { PostImage } from './post-image.entity';
import { PostComment } from './post-comment.entity';
import { PostTag } from './post-tag.entity';

@Entity('posts')
export class Post extends AbstractEntityUUID {

    @Column({ type: 'varchar', nullable: false, length: 255 })
    title: string;

    @Column({ type: 'varchar', nullable: true })
    content: string;

    @Column({ type: 'int', nullable: true })
    replies: number;

    @Column({ type: 'int', nullable: false, default: 0 })
    views: number;

    @ManyToOne(() => Educator, (educator) => educator.posts, { nullable: false })
    educator: Educator;

    @OneToMany(() => PostImage, (postImage) => postImage.post, { nullable: false })
    postImages: PostImage[];

    @OneToMany(() => PostComment, (postComment) => postComment.post, { nullable: false })
    postComments: PostComment[];

    @OneToMany(() => PostTag, (postTag) => postTag.post, { nullable: false })
    postTags: PostTag[];
}
