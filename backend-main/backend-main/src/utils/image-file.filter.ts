export const imageFileFilter = ( req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void, ) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};