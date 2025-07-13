export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur',
      {
        headers: {
          'User-Agent': 'crypto-tax-tracker',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Bitcoin price fetched:', data);
    
    return Response.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    return Response.json(
      { error: 'Failed to fetch Bitcoin price' },
      { status: 500 }
    );
  }
}