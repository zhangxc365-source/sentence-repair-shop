export const TOYS = [
  { id: 1, name: 'Teddy Bear', broken: '损坏玩具熊', fixed: '修复玩具熊', color: 'bg-blue-200', brokenImg: '/assets/toys/玩具1.png', fixedImg: '/assets/toys/修复玩具1.png' },
  { id: 2, name: 'Toy Airplane', broken: '损坏玩具飞机', fixed: '修复玩具飞机', color: 'bg-red-200', brokenImg: '/assets/toys/玩具2.png', fixedImg: '/assets/toys/修复玩具2.png' },
  { id: 3, name: 'Toy Robot', broken: '损坏玩具机器人', fixed: '修复玩具机器人', color: 'bg-yellow-200', brokenImg: '/assets/toys/玩具3.png', fixedImg: '/assets/toys/修复玩具3.png' },
  { id: 4, name: 'Toy Drum', broken: '损坏玩具鼓', fixed: '修复玩具鼓', color: 'bg-green-200', brokenImg: '/assets/toys/玩具4.png', fixedImg: '/assets/toys/修复玩具4.png' },
  { id: 5, name: 'Toy Train', broken: '损坏玩具火车', fixed: '修复玩具火车', color: 'bg-purple-200', brokenImg: '/assets/toys/玩具5.png', fixedImg: '/assets/toys/修复玩具5.png' },
  { id: 6, name: 'Toy Penguin', broken: '损坏玩具企鹅', fixed: '修复玩具企鹅', color: 'bg-orange-200', brokenImg: '/assets/toys/玩具6.png', fixedImg: '/assets/toys/修复玩具6.png' },
  { id: 7, name: 'Camera', broken: '损坏照相机', fixed: '修复照相机', color: 'bg-teal-200', brokenImg: '/玩具7.png', fixedImg: '/修复玩具7.png' },
  { id: 8, name: 'Sailboat', broken: '损坏帆船', fixed: '修复帆船', color: 'bg-indigo-200', brokenImg: '/玩具8.png', fixedImg: '/修复玩具8.png' },
  { id: 9, name: 'Dinosaur', broken: '损坏恐龙', fixed: '修复恐龙', color: 'bg-green-300', brokenImg: '/玩具9.png', fixedImg: '/修复玩具9.png' },
  { id: 10, name: 'Fire Truck', broken: '损坏消防车', fixed: '修复消防车', color: 'bg-red-400', brokenImg: '/玩具10.png', fixedImg: '/修复玩具10.png' },
  { id: 11, name: 'Cup', broken: '损坏杯子', fixed: '修复杯子', color: 'bg-yellow-100', brokenImg: '/玩具11.png', fixedImg: '/修复玩具11.png' },
  { id: 12, name: 'Piano', broken: '损坏琴', fixed: '修复琴', color: 'bg-purple-100', brokenImg: '/玩具12.png', fixedImg: '/修复玩具12.png' },
  { id: 13, name: 'Truck', broken: '损坏卡车', fixed: '修复卡车', color: 'bg-slate-300', brokenImg: '/玩具13.png', fixedImg: '/修复玩具13.png' },
  { id: 14, name: 'Elephant', broken: '损坏大象', fixed: '修复大象', color: 'bg-blue-300', brokenImg: '/玩具14.png', fixedImg: '/修复玩具14.png' },
  { id: 15, name: 'Soccer Ball', broken: '损坏足球', fixed: '修复足球', color: 'bg-white', brokenImg: '/玩具15.png', fixedImg: '/修复玩具15.png' },
  { id: 16, name: 'Rocket', broken: '损坏火箭', fixed: '修复火箭', color: 'bg-orange-300', brokenImg: '/玩具16.png', fixedImg: '/修复玩具16.png' },
  { id: 17, name: 'Blocks', broken: '损坏积木', fixed: '修复积木', color: 'bg-rose-200', brokenImg: '/玩具17.png', fixedImg: '/修复玩具17.png' },
  { id: 18, name: 'Ring Toss', broken: '损坏套圈', fixed: '修复套圈', color: 'bg-emerald-200', brokenImg: '/玩具18.png', fixedImg: '/修复玩具18.png' },
  { id: 19, name: 'Electronic Keyboard', broken: '损坏电子琴', fixed: '修复电子琴', color: 'bg-violet-200', brokenImg: '/玩具19.png', fixedImg: '/修复玩具19.png' },
  { id: 20, name: 'Jeep', broken: '损坏吉普车', fixed: '修复吉普车', color: 'bg-lime-200', brokenImg: '/玩具20.png', fixedImg: '/修复图片20.png' },
];

export const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
