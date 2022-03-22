// download() downloads files from IPFS. It is called
// by HTML and JavaScript. (e.g., import {download} from
// 'js/ipfs-downloader.js')
export async function download() {
    console.log("ipfs");

    /*
    const ipfs = await IPFS.create()
    const { cid } = await ipfs.add('Hello world!')
    console.info(cid)
    */

    const fs = require('fs');
    const ipfsAPI = require('ipfs-core');
    const ipfs = ipfsAPI('127.0.0.1', '5001', {protocol: 'http'})

    // elephants.mp4 video chunks. 
    // need to convert into specific format. (JSON)
    const CID = [
        "QmTUyCpmqExmxReEsDNLa36JEHnmFnBdpngCvj944Abm8w",
        "QmTmcv6V1dVpW4bmZXdzCYYLpdMN1N44YpmhpaJHKeWaRi",
        "QmWEpB5V3S5VYyx6RHpCEYAcSUXK7g94s9A6t26XBjKznU",
        "QmeU5BTCTSLB1cDoGsMPkqfU3Y7FtJJwEsgr4Tcz7G8PK2",
        "QmU6zLGFkVrpy4cJZ6wAEFuUNmWhpMKzM8JLkcBVZ9jqvL",
        "QmZkuu6eK3E6DNcgKsmsrv7Y67MhNBsDU6ryXmKi5BuLxW",
        "QmfNxuRFaVLXvhRHfh4hTdPvyA899pzvSo78YCiV9wDrJL",
        "Qmd1L9apPQYugWT6pCgkcx5zpwn7Nh4TiqZYKCykHdN44X",
        "QmUH3DjHNdx1uKYohARpG91P5msBCnDThcUcSNRZhFK35w",
        "QmS9VqQoM6YPnfexU88RMfLjH4G2x3ZUwV4rWttqf8RjtG",
        "QmTy7jSvka3Hxyn5VubHZZ734mbqv6rfW1hRmZnUBhkrng",
        "Qmc4SYibzXL2rXE9XdgfnMxx95fbNi56LwqErdEMQa6ECa",
        "QmSYpNveJqCGoPTLwyA3g6xmiXLS3ExZTD3U1nwSQni79H",
        "QmTxHXhFHN4wX6G1cHDaL3ukN3xqGAbD8SP99oYnxHzf6y",
        "QmcLRgjjs5LckTpgwoy6Z2wUP8pPkTNgNwJ2NSo5b9qNQc",
        "QmSMymQKhTmbQUJNpwJrVeWp8MRnrQxvd9Udi6s8Qt93bU",
        "QmVXzTCdS6YNVQJJe26GLW1g41GPXpadYEE13akkukSn8b",
        "QmT8rnc4mbEGfzo61F5E7Rtw92ZcWhRXxnz5sem4LDVPn3",
        "QmU5aNqHMoRiEXRNZN8EovNJdTWwFJPZYGR5ZkFp52uSsN",
        "QmbtMcHQMD4wVgyyHDWXMLqkVJn91JwxuVamatzLXK65a3",
        "Qmem8Gt6x5bUYksQyzr9mp9CT3EHQWx4ggbHRwpssrFKs9",
        "QmVj7764oq2rxLCcwynQYnGZ1vuGnV2wSYEQvTRyvcu4Dw",
        "QmdFEEvPj19hkHpgumvGhVTXTBG9VSiyuL9YEpQoZ3GYK3",
        "QmXSJZC7WSJTA7gd2KPWKgPZuojnds3qsXaJg4LUAKATDX",
        "QmVvCaEHrckhxqZ9Eyhvsvrv2Goj4iKZP6ZVqDTsTtaRfi",
        "QmTeC1EqYNgmMjtAT4Ru6dMT1oBXmoAGDwrVwGxgU1kZVS",
        "QmQ4SqCAauYGbKDxhUrBwWGo6T1C7qqLzhJTaixNkY9ZyR",
        "QmPhLwzDMba9uHVt3NbWNBavhvMdvKmYvoXZoKh6atcsBu",
        "QmYcwG3Yt9hCCDYtUpd8YrVcbwxKkh1EfdPfPz7o4jzMyE",
        "QmYbGXsyHxhjnkngZC5ziddDUaZubFSUY8z5QXa7UtN8SH"
    ];

    let downloadFile;

    for(let i=0; i<5; i++) {
        ipfs.files.get(CID[i], (err, files) => {
            files.forEach((file) => {
                console.log(file.path);
                //console.log(file.content.toString('utf8'))
                downloadFile = file.content.toString('utf8')
            
                fs.writeFileSync(`el_10_${i+1}.m4s`, downloadFile, 'utf8', (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            })
        })
    }
}