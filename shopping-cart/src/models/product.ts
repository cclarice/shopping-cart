export interface IProduct {
  id: number
  name: string
  price: number
}

export interface IItem extends IProduct {
  amount: number
}
