export function GET() {
   return new Response(JSON.stringify({ message: 'Oii muniki!' }));
}

export async function POST({ request }) {
   const body = await request.json();

   const token = request.headers.get('authorization')?.split(' ')?.[1] ?? 'Not found';

   console.log('Received JSON:', body);
   console.log('Custom Header:', token);

   return new Response(
      JSON.stringify({ message: `Your token is: ${ token }`, body, token: token }),
      {
         status: 200,
         headers: {
            'Content-Type': 'application/json'
         }
      }
   );
}