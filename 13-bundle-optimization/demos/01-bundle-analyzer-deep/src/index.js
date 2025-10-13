import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// 演示：完整导入 lodash（体积大）
import _ from 'lodash';

// 演示：导入 moment.js（包含所有 locale）
import moment from 'moment';
import 'moment/locale/zh-cn';

// 演示：导入 axios
import axios from 'axios';

console.log('Lodash version:', _.VERSION);
console.log('Moment version:', moment.version);
console.log('Axios version:', axios.VERSION);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

