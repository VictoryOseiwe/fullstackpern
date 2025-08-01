import { sql } from "../config/db.js";

//CRUD operations for products
// Ensure that the database connection is established before performing operations
export const getAllProduct = async (req, res) => {
  try {
    const products = await sql`
    SELECT * FROM products ORDER BY created_at DESC
  `;
    console.log("Products fetched successfully:", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, image, price } = req.body;

  if (!name || !image || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newProduct = await sql`
      INSERT INTO products (name, image, price)
      VALUES (${name}, ${image}, ${price})
      RETURNING *
    `;
    console.log("Product created successfully:", newProduct[0]);
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price } = req.body;
  if (!name || !image || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const updatedProduct = await sql`
        UPDATE products
        SET name = ${name}, image = ${image}, price = ${price}
        WHERE id = ${id}
        RETURNING *
      `;
    if (updatedProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Product updated successfully:", updatedProduct[0]);
    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING *
    `;
    if (deletedProduct.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("Product deleted successfully:", deletedProduct[0]);
    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
