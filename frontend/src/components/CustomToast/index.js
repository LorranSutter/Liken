import React from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

const CustomToast = styled(ToastContainer).attrs({
    bodyClassName: 'body',
    progressClassName: 'progress',
})`
    width: 30%;
    .body {
        color: #595959;
    }
    .progress {
        background: #35C0EDff;
    }
  `;

export default CustomToast;