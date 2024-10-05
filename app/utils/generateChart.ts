import { createCanvas } from 'canvas';
import Chart from 'chart.js/auto';

// 차트 생성 함수
export const generateChart = () => {
    const canvas = createCanvas(600, 600); // 크기를 더 크게 설정
    const ctx: any = canvas.getContext('2d');

    const chartConfig: any = {
        type: 'line',
        data: {
            labels: ['21-Aug', '28-Aug', '4-Sep', '11-Sep', '18-Sep', '25-Sep', '26-Sep'],
            datasets: [
                {
                    label: 'claim',
                    data: [25000, 27000, 35000, 29000, 45000, 46000, 40000],
                    //data: [5000, 7000, 5000, 9000, 5000, 6000, 4000],
                    //data: [125000, 127000, 35000, 229000, 115000, 106000, 4000],
                    borderColor: 'white', // 선 색상
                    backgroundColor: 'rgba(0, 0, 0, 0.1)', // 채워지는 영역 투명도
                    fill: true, // 영역 차트로 만듬
                    pointBackgroundColor: 'red', // 데이터 포인트 색상
                    pointRadius: 2, // 데이터 포인트 크기
                    tension: 0.3, // 선의 부드러움 조정
                }
            ]
        },
        options: {
            responsive: false,
            animation: false,
            layout: {
                padding: {
                    top: 10,
                    bottom: 250, // X축이 잘리지 않도록 아래쪽에 패딩 추가
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'white', // 레전드 텍스트 색상
                        font: {
                            size: 12, // 레전드 텍스트 크기
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'recent 7 days',
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold',
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)', // 그리드 선을 흐리게
                        lineWidth: 1, // 그리드 선 두께
                        borderDash: [5, 5], // 점선 스타일
                    },
                    ticks: {
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold', // Y축 값들을 bold로 설정
                        }
                    },
                    border: {
                        color: 'white', // X축 검은색 선
                        width: 2, // X축 선 두께
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Available Claim',
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold',
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)', // Y축 그리드 선 색상 조정
                        lineWidth: 1, // Y축 그리드 선 두께
                        borderDash: [5, 5], // 점선 스타일
                    },
                    ticks: {
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold', // Y축 값들을 bold로 설정
                        },
                        //stepSize: 7000, // Y축 간격을 100으로 설정
                    },
                    min: 25000, // Y축 최소값
                    max: 46000, // Y축 최대값을 45000으로 설정하여 간격 조정
                    // min: 4000, // Y축 최소값
                    // max: 9000, // Y축 최대값을 45000으로 설정하여 간격 조정
                    // min: 4000, // Y축 최소값
                    // max: 229000, // Y축 최대값을 45000으로 설정하여 간격 조정
                    border: {
                        color: 'white', // Y축 검은색 선
                        width: 2, // Y축 선 두께
                    }
                }
            }
        }
    };

    new Chart(ctx, chartConfig);

    return canvas.toBuffer();  // 이미지를 Buffer로 반환
};





// import { NextResponse } from "next/server";
// import { NextApiHandler } from 'next';
// import { createCanvas } from 'canvas';
// import Chart, { ChartConfiguration } from 'chart.js/auto';


// const handler: NextApiHandler = async (req, res) => {
//     if (req.method === 'GET') {
//         const data = { 
//             pokemon: {
//                 name: '꼬부기'
//             }
//         }
//         res.status(200).json({ data: data })
//     } 

//     if (req.method === 'POST') {
//         const canvas = createCanvas(800, 600);
//         const ctx: any = canvas.getContext('2d');

//         const chartConfig: ChartConfiguration = {
//             type: 'bar',
//             data: {
//             labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//             datasets: [
//                 {
//                     label: '# of Votes',
//                     data: [12, 19, 3, 5, 2, 3]
//                 }
//             ]
//             },
//             options: {
//             responsive: false,
//             plugins: {
//                 legend: {
//                 position: 'top'
//                 }
//             }
//             }
//         };
//         const chart = new Chart(ctx, chartConfig);
//         const imageData = canvas.toBuffer();
    
//         res.writeHead(200, {
//             'Content-Type': 'image/png',
//           });
//         res.end(imageData);
//     }
// };

// export default handler;



// import { ChartJSNodeCanvas } from "chartjs-node-canvas";

// const width = 800; // 차트 너비
// const height = 600; // 차트 높이

// export async function generateChart() {
//   const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

//   // 차트 구성 설정
//   const chartConfig: any = {  // 타입을 any로 지정해서 타입 충돌 방지
//     type: "bar", // 차트 종류
//     data: {
//       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"], // x축 레이블
//       datasets: [
//         {
//           label: "# of Votes", // 데이터셋 레이블
//           data: [12, 19, 3, 5, 2, 3], // 데이터 값
//           backgroundColor: ["red", "blue", "yellow", "green", "purple", "orange"], // 배경색
//         },
//       ],
//     },
//     options: {
//       responsive: false, // 서버에서는 반응형 차트를 사용하지 않음
//       animation: false, // 서버에서는 애니메이션 사용하지 않음
//       plugins: {
//         legend: {
//           display: true, // 범례 표시
//           position: "top", // 범례 위치
//         },
//       },
//       scales: {
//         x: {
//           display: true, // x축 표시
//         },
//         y: {
//           display: true, // y축 표시
//         },
//       },
//     },
//   };

//   // 차트를 이미지 버퍼로 렌더링
//   return await chartJSNodeCanvas.renderToBuffer(chartConfig);
// }

