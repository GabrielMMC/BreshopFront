import main1 from '../assets/logo/main-black.svg'
import main2 from '../assets/logo/main-purple.svg'
import main3 from '../assets/logo/main-white.svg'

import circle1 from '../assets/logo/circle-black.svg'
import circle2 from '../assets/logo/circle-purple.svg'
import circle3 from '../assets/logo/circle-white.svg'

import main_without_circle1 from '../assets/logo/main-only-text-purple.png'

// todas as logos, sendo necessario importar só uma vez
const LogosObj = {
  main: {
    black: main1,
    purple: main2,
    white: main3,
  },
  circle: {
    black: circle1,
    purple: circle2,
    white: circle3,
  },
  main_without_circle: {
    purple: main_without_circle1,
  }
}

export default LogosObj