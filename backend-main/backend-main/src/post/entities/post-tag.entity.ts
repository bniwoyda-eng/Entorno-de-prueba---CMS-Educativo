import { Entity, ManyToOne } from 'typeorm';
import { AbstractEntityUUID, Post, Tag } from 'src/exports/entities';

@Entity('posts_tags')
export class PostTag extends AbstractEntityUUID {

    @ManyToOne(() => Post, (post) => post.postTags, { nullable: false })
    post: Post;

    @ManyToOne(() => Tag, (tag) => tag.postTags, { nullable: false, eager: true })
    tag: Tag;

}
