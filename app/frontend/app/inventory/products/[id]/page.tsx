"use client"

import { useForm } from "react-hook-form"
import { use, useState, useEffect } from "react"
import productsData from "../sample/dummy_products.json"
import inventoriesData from "../sample/dummy_inventories.json"

type ProductData = {
  id: number
  name: string
  price: number
  description: string
}

type FormData = {
  id: number
  quantity: number
}

type InventoryData = {
  id: number
  type: string
  date: string
  unit: number
  quantity: number
  price: number
  inventory: number
}

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = use(params)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // 読み込みデータを保持
  const [product, setProduct] = useState<ProductData>({
    id: 0,
    name: "",
    price: 0,
    description: "",
  })

  // 読み込みデータを保持
  const [data, setData] = useState<Array<InventoryData>>([])
  // submit時のactionを分岐させる
  const [action, setAction] = useState<string>("")

  useEffect(() => {
    const selectedProduct: ProductData = productsData.find(
      (v) => v.id == id
    ) ?? { id: 0, name: "", price: 0, description: "" }
    setProduct(selectedProduct)
    setData(inventoriesData)
  }, [params])

  const onSubmit = (event: any): void => {
    const data: FormData = {
      id: Number(id),
      quantity: Number(event.quantity),
    }

    // actionによってHTTPメソッドと使用するパラメータを切り替える
    if (action === "purchase") {
      handlePurchase(data)
    } else if (action === "sell") {
      if (data.id === null) {
        return
      }
      handleSell(data)
    }
  }

  // 仕入れ・卸し処理
  const handlePurchase = (data: FormData) => {
    console.log(`仕入れ ID: ${data.id}, 数量: ${data.quantity}`)
  }

  const handleSell = (data: FormData) => {
    console.log(`卸し ID: ${data.id}, 数量: ${data.quantity}`)
  }

  return (
    <>
      <h2>商品在庫</h2>
      <h3>在庫処理</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>商品名</label>
          <span>{product.name}</span>
        </div>
        <div>
          <label>数量：</label>
          <input
            type="number"
            id="quantity"
            {...register("quantity", {
              required: "必須入力です",
              min: 1,
              max: 99999999,
            })}
          />
          {errors.quantity && <div>1から99999999の数値を入力してください</div>}
        </div>
        <button type="submit" onClick={() => setAction("purchase")}>
          商品を仕入れる
        </button>
        <button type="submit" onClick={() => setAction("sell")}>
          商品を卸す
        </button>
      </form>
      <h3>在庫履歴</h3>
      <table>
        <thead>
          <tr>
            <th>処理種別</th>
            <th>処理日時</th>
            <th>単価</th>
            <th>数量</th>
            <th>価格</th>
            <th>在庫数</th>
          </tr>
        </thead>
        <tbody>
          {inventoriesData.map((data: InventoryData) => (
            <tr key={data.id}>
              <td>{data.type}</td>
              <td>{data.date}</td>
              <td>{data.unit}</td>
              <td>{data.quantity}</td>
              <td>{data.price}</td>
              <td>{data.inventory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
