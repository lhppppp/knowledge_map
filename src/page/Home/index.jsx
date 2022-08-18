import React, { useEffect, useState } from 'react'
import MyMap from '../../component/MyMap'
import Header from '../../component/Header'
import '../../assets/style/Home/index.scss'
import { Descriptions } from 'antd';

export default function Home() {



  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

  const [myDetail, setMyDetail] = useState();
  const [showDetail, setShowDetail] = useState([]);

  const getDetail = (msg) => {
    setMyDetail(msg);
  }

  useEffect(() => {
    console.log(myDetail);
    let tempArray = [];
    for (let key in myDetail) {
      if (key !== 'id' && key !== 'label')
        tempArray.push({
          'key': key,
          'value': myDetail[key]
        })
    }
    // console.log(tempArray);
    setShowDetail(tempArray);
  }, [myDetail])

  return (
    <div className='Home_page'>
      <Header />
      <MyMap getDetail={getDetail} />
      <Descriptions
        className='detailList'
        title="Details (Click on a node for details)"
        bordered
      >
        {/* <Descriptions.Item label="Product">1</Descriptions.Item><br /><br />
        <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item><br /><br />
        <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item><br /><br />
        <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item> */}
        {
          myDetail?.label !== undefined ? <><Descriptions.Item label="name">{myDetail?.label}</Descriptions.Item><br /><br /></> : ''
        }
        {
          showDetail.map((item) => {
            return (
              <>
                <Descriptions.Item key={item.value} label={item.key}>{item.value}</Descriptions.Item><br /><br />
              </>
            )
          })
        }

      </Descriptions>
    </div>
  )
}
