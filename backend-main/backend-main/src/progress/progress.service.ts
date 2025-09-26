import { Injectable } from '@nestjs/common';
import { UpdateProgressDto } from './dto';
import { ProgressStrategyFactory } from './strategy';
import { User } from 'src/exports/entities';

@Injectable()
export class ProgressService {

  constructor(private readonly factory: ProgressStrategyFactory) { }

  getGlobalProgress(user: User) {
    const { id: userId, roles } = user;
    const strategy = this.factory.getStrategy(roles[0]);
    return strategy.getGlobalProgress(userId);
  }

  getCourseProgress(user: User, courseId: string) {
    const { id: userId, roles } = user;
    const strategy = this.factory.getStrategy(roles[0]);
    return strategy.getCourseProgress(userId, courseId);
  }

  getMaterialProgress(user: User, materialId: string) {
    const { id: userId, roles } = user;
    const strategy = this.factory.getStrategy(roles[0]);
    return strategy.getMaterialProgress(userId, materialId);
  }

  updateMaterialProgress(user: User, materialId: string, updateProgressDto: UpdateProgressDto) {
    const { id: userId, roles } = user;
    const strategy = this.factory.getStrategy(roles[0]);
    return strategy.updateMaterialProgress(userId, roles[0], materialId, updateProgressDto);
  }

}
