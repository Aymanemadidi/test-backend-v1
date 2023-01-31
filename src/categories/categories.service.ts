import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}
  async create(createCategoryInput: CreateCategoryInput) {
    const category = await this.categoryModel
      .findOne({
        name: createCategoryInput.name,
      })
      .exec();
    if (category) {
      throw new BadRequestException('Cette categorie existe déjà');
    }
    createCategoryInput.created_at = new Date();
    const newCategory = new this.categoryModel(createCategoryInput);
    newCategory.save();
    if (newCategory.parent !== null) {
      console.log('I enter if');
      const parentCategory = await this.categoryModel.findOneAndUpdate(
        {
          _id: createCategoryInput.parent,
        },
        { $push: { subCategories: newCategory._id } },
      );
      console.log(parentCategory);
    }

    return newCategory;
  }

  findAll() {
    return this.categoryModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput) {
    const realId = new mongoose.Types.ObjectId(id);
    // let subCats = [];
    // let parent: any = '';
    // let parent = new mongoose.Types.ObjectId(id);

    if (!updateCategoryInput.parent) {
      console.log('normal change');
      const toBeRemoved = await this.categoryModel.findOneAndUpdate(
        { _id: id },
        { $set: updateCategoryInput },
        { new: true },
      );
      if (!toBeRemoved) {
        throw new NotFoundException("Cette categorie n'existe pas");
      }
    } else {
      console.log('change of parent');

      const toBeRemoved = await this.categoryModel.findOne({ _id: id });
      const oldParentId = toBeRemoved.parent;

      await this.categoryModel.findOneAndUpdate(
        { _id: id },
        { $set: updateCategoryInput },
        { new: true },
      );

      const oldParent = await this.categoryModel.findOneAndUpdate(
        {
          _id: oldParentId,
        },
        {
          $pull: {
            subCategories: realId,
          },
        },
        // {
        //   $pull: { subCategories: realId },
        // },
      );
      const newParent = await this.categoryModel.findOneAndUpdate(
        {
          _id: updateCategoryInput.parent,
        },
        {
          $push: { subCategories: realId },
        },
      );
    }
    return true;
  }

  async remove(id: string) {
    const realId = new mongoose.Types.ObjectId(id);
    let subCats = [];
    let parent: any = '';
    // let parent = new mongoose.Types.ObjectId(id);

    const toBeRemoved = await this.categoryModel.findOne({ _id: id });
    if (toBeRemoved.subCategories.length) {
      console.log('The category you are trying to delete has some subcats');
      subCats = toBeRemoved.subCategories;
      parent = toBeRemoved.parent;
      console.log('subCats: ', subCats);
      console.log('parent: ', parent);
      subCats.forEach(async (element) => {
        await this.categoryModel.findOneAndUpdate(
          {
            _id: element,
          },
          {
            $set: { parent: parent },
          },
        );
      });

      await this.categoryModel.findOneAndUpdate(
        {
          _id: parent,
        },
        {
          $push: { subCategories: { $each: subCats } },
        },
      );
    }

    toBeRemoved.remove();
    // const catsWithToBeRemovedAsParent = await this.categoryModel.find({
    //   parent: id,
    // });
    const updated = await this.categoryModel.updateMany(
      { subCategories: { $in: [realId] } },
      {
        $pullAll: {
          subCategories: [realId],
        },
      },
    );

    // console.log('updated: ', updated);

    // const catsThatHaveToBeRemovedInSubs = await this.categoryModel.find({
    //   subCategories: { $in: [realId] },
    // });
    // for (const cat of catsThatHaveToBeRemovedInSubs) {
    //   const newSubsArr = cat.subCategories.filter((c) => c.toString() !== id);
    //   console.log('newSubsArr: ', newSubsArr);
    // }
    // console.log('catsWithToBeRemovedAsParent: ', catsWithToBeRemovedAsParent);
    // console.log(
    //   'catsThatHaveToBeRemovedInSubs: ',
    //   catsThatHaveToBeRemovedInSubs,
    // );
    return true;
  }

  async findAllAgr() {
    const categories = await this.categoryModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'subCategories',
          foreignField: '_id',
          as: 'sub',
          pipeline: [
            {
              $lookup: {
                from: 'categories',
                localField: 'subCategories',
                foreignField: '_id',
                as: 'sub',
                pipeline: [
                  {
                    $lookup: {
                      from: 'categories',
                      localField: 'subCategories',
                      foreignField: '_id',
                      as: 'sub',
                    },
                  },
                  // { $unwind: '$sub' },
                ],
              },
            },
            //   { $unwind: '$sub' },
          ],
        },
      },
      // { $push: '$sub' },
    ]);

    console.log(categories);

    return categories;
  }
}
