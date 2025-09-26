import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntityUUID, Post } from 'src/exports/entities';

@Entity('posts_images')
export class PostImage extends AbstractEntityUUID {

    @Column({ type: 'varchar', nullable: false, length: 255 })
    originalName: string;

    @Column({ type: 'varchar', nullable: false, length: 1024 })
    imageKey: string; 

    @Column({ type: 'varchar', nullable: false, length: 255 })
    slug: string;


    @Column({ type: 'int', nullable: false, default: 0 })
    size: number;
    
    @Column({ type: 'varchar', nullable: false, length: 255 })
    mimeType: string;

    @ManyToOne(() => Post, (post) => post.postImages, { nullable: false })
    post: Post;
}
