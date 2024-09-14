// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { nanoid } from "nanoid";
import IconButton from "./IconButton";
import JSConfetti from 'js-confetti'; 
import { Container } from "react-bootstrap";
import Fuse from 'fuse.js';

const shops = [
  { id: 0, name: "Migros" },
  { id: 1, name: "Carrefour" },
  { id: 2, name: "BİM" },
  { id: 3, name: "ŞOK" },
  { id: 4, name: "A-101" },
];

const categories = [
  { id: 0, name: "Elektirik" },
  { id: 1, name: "Şarküteri" },
  { id: 2, name: "Bakliyat" },
  { id: 3, name: "Fırın" },
  { id: 4, name: "Meyve" },
  { id: 5, name: "Sebze" },
];

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function App() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterShop, setFilterShop] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const alertShownRef = useRef(false);
  const jsConfetti = new JSConfetti();

  

  const fuse = new Fuse(products, {
    keys: ['name', 'shop', 'category'],
    includeScore: true,
    threshold: 0.3,
  });

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: nanoid(),
        name: productName,
        shop: selectedShop,
        category: selectedCategory,
        isBought: false,
      },
    ]);
    setProductName("");
    setSelectedShop("");
    setSelectedCategory("");
  };

  const handleToggleBought = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, isBought: !product.isBought }
          : product
      )
    );
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const filteredProducts = products
    .filter(product => 
      (filterShop ? product.shop === filterShop : true) &&
      (filterCategory ? product.category === filterCategory : true) &&
      (filterStatus ? product.isBought === (filterStatus === "bought") : true)
    );

  const searchResults = debouncedSearchQuery
    ? fuse.search(debouncedSearchQuery).map(result => result.item)
    : filteredProducts;

  useEffect(() => {
    if (products.length > 0 && products.every((product) => product.isBought)) {
      if (!alertShownRef.current) {
        alert("Alışveriş Tamamlandı");
        jsConfetti.addConfetti();
        jsConfetti.addConfetti({
          emojis: ['💸'],
       })
        alertShownRef.current = true;
      }
    } else {
      alertShownRef.current = false;
    }
  }, [products]);

  return (
    <Container>
      <h1>Alışveriş Listesi</h1>
      <Form.Group className="mb-3">
        <Form.Label>Ürün</Form.Label>
        <Form.Control
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          placeholder="Ürün girin."
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Market</Form.Label>
        <Form.Select
          value={selectedShop}
          onChange={(event) => setSelectedShop(event.target.value)}
        >
          <option value="">Market Seçin</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.name}>
              {shop.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Kategori</Form.Label>
        <Form.Select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="">Kategori Seçin</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <button onClick={handleAddProduct} className="btn btn-primary">
        Ürün Ekle
      </button>
      <Form.Group className="mt-3">
        <Form.Label>Arama</Form.Label>
        <Form.Control
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Arama yapın..."
        />
      </Form.Group>
      <Form.Group className="mt-3">
        <Form.Label>Filtrele</Form.Label>
        <div className="d-flex">
          <Form.Select
            value={filterShop}
            onChange={(event) => setFilterShop(event.target.value)}
            className="form-select-sm me-2"
          >
            <option value="">Market Seçin</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.name}>
                {shop.name}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
            className="form-select-sm me-2"
          >
            <option value="">Kategori Seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Form.Select>
          <div className="d-flex align-items-center">
            <Form.Check
              type="radio"
              id="filterAll"
              name="filterStatus"
              label="Tümü"
              checked={filterStatus === ""}
              onChange={() => setFilterStatus("")}
              className="me-2"
            />
            <Form.Check
              type="radio"
              id="filterBought"
              name="filterStatus"
              label="Satın Alınanlar"
              checked={filterStatus === "bought"}
              onChange={() => setFilterStatus("bought")}
              className="me-2"
            />
            <Form.Check
              type="radio"
              id="filterNotBought"
              name="filterStatus"
              label="Satın Alınmayanlar"
              checked={filterStatus === "notBought"}
              onChange={() => setFilterStatus("notBought")}
              className="me-2"
            />
          </div>
        </div>
      </Form.Group>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Market</th>
            <th>Kategori</th>
            <th>Satın Alındı</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((product) => (
            <tr key={product.id}>
              <td className={product.isBought ? "strikethrough" : ""}>
                {product.name}
              </td>
              <td>{product.shop}</td>
              <td>{product.category}</td>
              <td>
                <button
                  onClick={() => handleToggleBought(product.id)}
                  className={`btn ${
                    product.isBought ? "btn-success" : "btn-warning"
                  }`}
                >
                  {product.isBought ? "Satın Alındı" : "Satın Al"}
                </button>
              </td>
              <td>
                <IconButton onClick={() => handleDeleteProduct(product.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
