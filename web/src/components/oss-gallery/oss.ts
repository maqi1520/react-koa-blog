import OSS from 'ali-oss'

const client = new OSS({
  accessKeyId: process.env.NEXT_PUBLIC_OSS_accessKeyId,
  accessKeySecret: process.env.NEXT_PUBLIC_OSS_accessKeySecret,
  //stsToken: result.SecurityToken,
  // region表示您申请OSS服务所在的地域，例如oss-cn-hangzhou。
  region: process.env.NEXT_PUBLIC_OSS_region,
  bucket: process.env.NEXT_PUBLIC_OSS_bucket,
  endpoint: process.env.NEXT_PUBLIC_OSS_endpoint,
  cname: process.env.NEXT_PUBLIC_OSS_endpoint ? true : false,
})

export async function list(dir?: string) {
  try {
    // 不带任何参数，默认最多返回1000个文件
    const result = await client.list({
      prefix: dir,
      delimiter: '/',
      'max-keys': 1000,
    })
    return result
  } catch (error) {
    console.log(error)
  }
}

export async function multipartUpload(
  fileName: string,
  data: any,
  progress: (p: number) => void
) {
  try {
    // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
    const result = await client.multipartUpload(fileName, data, {
      progress,
    })
    return result
  } catch (e) {
    console.log(e)
  }
}

export async function putObject(fileName: string, data: any) {
  try {
    // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
    const result = await client.put(fileName, data)
    return result
  } catch (e) {
    console.log(e)
  }
}

export async function deleteMulti(ids: string[]) {
  try {
    const result = await client.deleteMulti(ids)

    return result
  } catch (e) {
    console.log(e)
  }
}
