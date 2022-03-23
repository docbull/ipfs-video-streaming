import process from 'process'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'

async function main() {
    /*
    const args = minimist(process.argv.slice(2))
    const token = args.token

    if (!token) {
        return console.error('A token is needed. You can create one on https://web3.storage')
    }

    if (args._.length < 1) {
        return console.error('Please supply the path to a file or directory')
    }
    */

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJlODkxZDY3MjJlOTBCNjVhM2Q2MDI1QURlNTEyMDU4MDJBMjQzN0IiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDc5Mjc1OTQ1ODAsIm5hbWUiOiJJTkxhYiJ9.k-W6-uizB3gwbUChR5gbkpFFnXamKRvmfm--atohh24'

    const client = new Web3Storage({ token })

    /*
    const res = await client.get('bafybeibmiboiqrl4cg2ngzrltpwn5qmer7ye54aabnkcn2mzcux2ucr25a')
    const files = await res.files()
    for (const file of files) {
        console.log(`${file.cid} ${file.name} ${file.size}`)
    }
    */
    
    const res = await client.get('bafybeibmiboiqrl4cg2ngzrltpwn5qmer7ye54aabnkcn2mzcux2ucr25a') // Web3Response
    const files = await res.files() // Web3File[]
    for (const file of files) {
        console.log(`${file.cid} ${file.name} ${file.size}`)
    }
}

main()