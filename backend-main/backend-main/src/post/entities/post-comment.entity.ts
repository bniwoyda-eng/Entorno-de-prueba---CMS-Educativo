import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntityUUID, Educator, Post } from 'src/exports/entities';

@Entity('posts_comments')
export class PostComment extends AbstractEntityUUID {

    @Column({ type: 'varchar', nullable: false, length: 255 })
    comment: string;

    @ManyToOne(() => Post, (post) => post.postComments, { nullable: false })
    post: Post;

    @ManyToOne(() => Educator, (educator) => educator.postComments, { nullable: false })
    educator: Educator;
}
