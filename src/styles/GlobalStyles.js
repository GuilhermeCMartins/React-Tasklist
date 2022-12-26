import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
    *{
        margin: 0px;
        padding: 5px;
        outline: none;
        box-sizing: border-box;
        font-family: 'Baloo 2';
        color: black
    }

    body{
        background-color: #1a1a1a;
    }

    html,body,:root{
        height: 100%;
    }


    a{
        text-decoration: none;

    }

    ul{
        list-style: none;
    }

    .toast-container{
      border-radius: 800px;
    }

`;
