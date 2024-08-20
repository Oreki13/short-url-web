// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Api_response, defaultResponse } from '@/type/api_response';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Api_response>
) {
  res.status(200).json({ ...defaultResponse, message: 'Hello' })
}
