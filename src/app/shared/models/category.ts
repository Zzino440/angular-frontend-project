export class Category {
  id!: number
  name!: string
  description!: string
  vocabularyId!: number
  vocabularyName!: string
  parentCategoryId!: any
  parentCategoryName!: any
  subCategories!: SubCategory[]
}

export interface SubCategory {
  id: number
  name: string
}
