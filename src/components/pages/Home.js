import React from "react";
import Navbar from "./Navbar";
import Card from './Card';
import { ThemeProvider, CircularProgress } from "@mui/material";
import { GET_PUBLIC_FETCH, URL } from '../../variables';
import Theme from '../routes/Theme/Theme';
import Slider from "react-slick";
import './Private/SideBar/styles/index.css';
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { settings } from "../utilities/Settings";
import { FaTshirt } from "react-icons/fa";
import { RiTShirt2Line } from "react-icons/ri";
import { GiDress } from "react-icons/gi";
import { GiGuitar } from "react-icons/gi";
import { GiUnderwearShorts } from "react-icons/gi";
import { IoIosGlasses } from "react-icons/io";
import SaleCard from "./SaleCard";
import art from '../../assets/art.png'
import Accordion from "./Accordion/Accordion";

const Home = () => {
  const [state, setState] = React.useState({
    pageNumber: 1,
    products: [],
  })
  const [types, setTypes] = React.useState('')
  const [styles, setStyles] = React.useState('')
  const [products, setProducts] = React.useState('')
  const [materials, setMaterials] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  const [type, setType] = React.useState('')
  const [style, setStyle] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [material, setMaterial] = React.useState('')

  React.useEffect(() => {
    getData()
  }, [type, material, style])

  const getData = async () => {
    const response = await GET_PUBLIC_FETCH({ url: `${URL}api/get_all_products?page=${state.pageNumber}&type_id=${type}&style_id=${style}&material_id=${material}` })
    console.log('resp', response)
    if (response.status) {
      setTypes(response.types)
      setStyles(response.styles)
      setProducts(response.products)
      setMaterials(response.materials)
    }
    setLoading(false)
  }

  return (
    <ThemeProvider theme={Theme}>
      <Navbar />
      <div style={{ background: 'linear-gradient(to bottom, #693B9F, #8C4EBE, #A57BD5)', minHeight: '40vh' }}>
        <div className="row w-principal p-5 m-auto">
          <div className='col-4' style={{ borderRadius: '56% 44% 66% 40% / 30% 33% 67% 70%', backgroundColor: '#FFF', height: 400 }}>
            <img src={art} alt="woman-art" className='h-100 d-flex justify-content-center m-auto' />
          </div>
          <div className="col-8 text-center m-auto text-white">
            <p className='main-title'>Conheça a nossa plataforma e começe a garimpar!</p>
            <p className='subtitle'>A plataforma atualmente se encontra em ambiente de testes</p>
            <p className='small'>Agradeço se reportar os bugs encontrados, de resto, <del>ta liberada a bagunça</del></p>
            {/* dedo no cu e gritaria */}
          </div>
        </div>
      </div>
      <div className='w-principal m-auto'>
        {/* <div className="mt-3" style={{ minHeight: '45vh' }}>
            <Typography className="m-3" variant="h5" color="text.secondary">Produtos recomendados para você</Typography>
            <Slider {...settings}>
              {state.products && state.products.map(item => (
                <Card product={item}></Card>
              ))}
            </Slider>
          </div> */}

        <div className="row my-5">
          <h6 className="title mx-4">Produtos postados recentemente</h6>
          <div className="col-md-2">
            <Accordion styles={styles} setStyle={setStyle} types={types} setType={setType} materials={materials} setMaterial={setMaterial} />
          </div>

          <div className='col-md-10'>
            {!loading ?
              <div className="d-flex flex-wrap justify-content-center pointer">
                {products && products.map(item => (
                  <div key={item.id}>
                    <Card sales={false} product={item} />
                  </div>
                ))}
              </div>
              : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
          </div>
        </div>

        <h6 className="title mx-4 mt-5">Categorias mais visitadas</h6>
        <div className="row justify-content-center">
          <div className="mx-5 my-3 hvr-grow align-items-center pointer" style={{ width: 175, height: 175 }}>
            <div className='category d-flex align-items-center m-auto'>
              <FaTshirt size={70} className='m-auto' />
            </div>
            <p className='subtitle text-center'>Casual</p>
          </div>

          <div className="mx-5 my-3 hvr-grow align-items-center pointer" style={{ width: 175, height: 175 }}>
            <div className='category d-flex align-items-center m-auto'>
              <GiDress size={70} className='m-auto' />
            </div>
            <p className='subtitle text-center'>Luxuoso</p>
          </div>

          <div className="mx-5 my-3 hvr-grow align-items-center pointer" style={{ width: 175, height: 175 }}>
            <div className='category d-flex align-items-center m-auto'>
              <IoIosGlasses size={70} className='m-auto' />
            </div>
            <p className='subtitle text-center'>Urbano</p>
          </div>

          <div className="mx-5 my-3 hvr-grow align-items-center pointer" style={{ width: 175, height: 175 }}>
            <div className='category d-flex align-items-center m-auto'>
              <GiUnderwearShorts size={70} className='m-auto' />
            </div>
            <p className='subtitle text-center'>Surfe</p>
          </div>

          <div className="mx-5 my-3 hvr-grow align-items-center pointer" style={{ width: 175, height: 175 }}>
            <div className='category d-flex align-items-center m-auto'>
              <GiGuitar size={70} className='m-auto' />
            </div>
            <p className='subtitle text-center'>Rocker</p>
          </div>
        </div>

        {/* <div style={{ minHeight: '40vh' }}>
          <Typography className="m-3" variant="h5" color="text.secondary">Ofertas Especiais</Typography>
          <div className="d-flex flex-wrap justify-content-center">
            {state.products && state.products.map(item => (
              <Card sales={true} product={item}></Card>
            ))}
          </div>
        </div> */}
      </div>
      <Footer />
    </ThemeProvider>
  );
};

export default Home;