declare type MySQLDateString = `${number}-${number}-${number} ${number}:${number}:${number}`;
declare type Datestring = MySQLDateString | string;

export default Datestring;
