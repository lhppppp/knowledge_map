import React, { useEffect, useState, useRef } from 'react'
import G6 from '@antv/g6';
import { Tooltip, Spin } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons';
import rootCircle from '../../assets/img/root.svg'
import teamCircle from '../../assets/img/team.svg'
import keywordCircle from '../../assets/img/keyword.svg'
import paperCircle from '../../assets/img/paper.svg'
import axios from 'axios'
import '../../assets/style/MyMap/index.scss'

const fittingString = (str, maxWidth, fontSize) => {
    const ellipsis = '...';
    const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
    let currentWidth = 0;
    let res = str;
    const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
    str.split('').forEach((letter, i) => {
        if (currentWidth > maxWidth - ellipsisLength) return;
        if (pattern.test(letter)) {
            // Chinese charactors
            currentWidth += fontSize;
        } else {
            // get the width of single letter according to the fontSize
            currentWidth += G6.Util.getLetterWidth(letter, fontSize);
        }
        if (currentWidth > maxWidth - ellipsisLength) {
            res = `${str.substr(0, i)}${ellipsis}`;
        }
    });
    return res;
};

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1: return parseInt(Math.random() * minNum + 1, 10);
        case 2: return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default: return 0;
    }
}

export default function MyMap(props) {

    const { getDetail } = props;

    const [myGraph, setMyGraph] = useState(null)
    const [myData, setMyData] = useState({})
    const [loading, setLoading] = useState(true)

    const mapRef = useRef();

    function refreshDragedNodePosition(e) {
        var model = e.item.get('model');
        model.fx = e.x;
        model.fy = e.y;
    }

    useEffect(() => {
        getDataRequest();
    }, [])

    const getDataRequest = () => {
        axios({
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            url: `http://qgailab.com/knowledge/common`,
        }).then(
            response => {
                console.log(response);
                setLoading(false);
                setMyData(response.data.data)
            },
            error => {
                console.log(error);
            }
        )
    }

    const getDetailRequest = (id) => {
        axios({
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            url: `http://qgailab.com/knowledge/common/${id}`,
        }).then(
            response => {
                console.log(response.data.data);
                getDetail(response.data.data)
                // setMyData(response.data.data)
            },
            error => {
                console.log(error);
            }
        )
    }

    useEffect(() => {

        // console.log(mapRef.current.clientWidth);
        // console.log(mapRef.current.clientHeight);

        const graph = new G6.Graph({
            container: 'MyMap_wrapper', // 指定图画布的容器 id，与第 9 行的容器对应
            // 画布宽高
            width: 1300,
            height: 500,
            // fitView: true,    modes: {
            modes: {
                default: ['drag-canvas',// 允许拖拽画布、放缩画布、拖拽节点
                    'zoom-canvas',
                    'drag-node',
                    {
                        type: 'activate-relations',
                        resetSelected: true,
                        trigger: 'click',
                        activeState: 'active',
                        inactiveState: 'inactive'
                    },
                    // {
                    //     type: 'tooltip',
                    //     formatText(model) {
                    //         return model.label;
                    //     }
                    // }
                ],
            },
            layout: {
                type: 'force',
                preventOverlap: true,  // 防止节点重叠
                linkDistance: d => {
                    return randomNum(100, 600);
                },
                nodeStrength: 0,
                nodeSize: 200,
                collideStrength: 0.2,
                alphaDecay: 0.01,
            },
            defaultNode: {
                size: [35, 35],
                style: {
                    lineWidth: 0,
                    stroke: '#fff'
                },
                labelCfg: {
                    style: {
                        fill: '#7f7f88',
                    }
                },
            },
            defaultEdge: {
                // shape: "line-with-arrow",
                style: {
                    stroke: '#d3d3d3',
                    fontSize: 8,
                    endArrow: true,
                    lineWidth: 2
                },
                labelCfg: {
                    refY: -10,
                    // autoRotate: true,
                }

            },
            nodeStateStyles: {
                active: {
                    style: {
                        lineWidth: 0,
                        // stroke: '#fff'
                    },
                    labelCfg: {
                        position: 'bottom',
                        style: {
                            fill: '#7f7f88',
                        }
                    },
                },
                inactive: {
                    style: {
                        lineWidth: 0,
                        opacity: 0.4,
                    },
                }

            },
            edgeStateStyles: {
                hover: {
                    stroke: '#6c9dfd',
                },
                active: {
                    style: {
                    },
                    labelCfg: {
                        style: {
                            fontSize: 8
                        }
                    }
                }
            }
        });

        graph.node((node) => {
            if (node.label === 'MAS+DP') {
                return {
                    size: [50, 50],
                    labelCfg: {
                        position: 'bottom',
                        fill: '#7f7f88',
                    },
                    style: {
                        fill: '#ee3f4d'
                    }
                }
            } else if (node.type === 1) {
                return {
                    labelCfg: {
                        position: 'bottom',
                        fill: '#7f7f88'
                    },
                    style: {
                        fill: '#f79c53'
                    }
                }
            } else if (node.type === 2) {
                return {
                    labelCfg: {
                        position: 'bottom',
                        fill: '#7f7f88'
                    },
                    style: {
                        fill: '#813c85'
                    }
                }
            } else if (node.type === 3) {
                return {
                    style: {
                        fill: '#323f7c'
                    },
                    labelCfg: {
                        style: {
                            fontSize: 0,
                        }
                    },
                }
            }

        })

        graph.edge((edge) => {
            return {
                labelCfg: {
                    refY: edge.label === '论文' ? -10 : 10,
                    style: {
                        fontSize: 0
                    }
                }
            }

        })
        setMyGraph(graph);
        // 读取数据
        let renderData = myData;
        // renderData?.nodes?.forEach(function (node) {
        //     if (node.label === 'MAS' || node.label === 'DP') node.label = fittingString(node.label, 50, 12);
        //     else node.label = fittingString(node.label, 40, 12);
        // });
        // console.log(renderData);
        graph.data(renderData);
        // console.log(myData);
        // 渲染图
        graph.render();

        graph.on('node:dragstart', function (e) {
            graph.layout();
            refreshDragedNodePosition(e);
        });
        graph.on('node:drag', function (e) {
            refreshDragedNodePosition(e);
        });
        graph.on('node:dragend', function (e) {
            e.item.get('model').fx = null;
            e.item.get('model').fy = null;
        });

        graph.on('node:click', (e) => {
            console.log(e);
            getDetailRequest(e.item._cfg.id)
        })

        graph.on('edge:mouseenter', (e) => {
            const edgeItem = e.item; // 获取鼠标进入的节点元素对象
            graph.setItemState(edgeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
        });

        // 鼠标离开边
        graph.on('edge:mouseleave', (e) => {
            const edgeItem = e.item; // 获取鼠标离开的边元素对象
            graph.setItemState(edgeItem, 'hover', false); // 设置当前边的 hover 状态为 false
        });

        return function () {
            graph.destroy();
        }
    }, [myData])

    return (
        <Spin spinning={loading}>
            <div id="MyMap_wrapper" ref={mapRef}>
                <div className="toolBox">
                    <span className='oneType'>
                        <img src={rootCircle} className='TypeColor_root TypeColor' />
                        <span className='TypeName_root TypeName'>root</span>
                    </span>
                    <span className='oneType'>
                        <img src={teamCircle} className='TypeColor_team TypeColor'/>
                        <span className='TypeName_team TypeName'>team</span>
                    </span>
                    <span className='oneType'>
                        <img src={keywordCircle} className='TypeColor_keyword TypeColor'/>
                        <span className='TypeName_keyword TypeName'>keyword</span>
                    </span>
                    <span className='oneType'>
                        <img src={paperCircle} className='TypeColor_paper TypeColor'/>
                        <span className='TypeName_paper TypeName'>paper</span>
                    </span>
                    <Tooltip className='myTip' title={'滚动鼠标滚轮可进行缩放'}>
                        <ZoomInOutlined />
                    </Tooltip>
                </div>
            </div>
        </Spin>
    )
}
