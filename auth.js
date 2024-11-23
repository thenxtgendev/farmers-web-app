async function refreshToken() {
    const url = 'https://login.salesforce.com/services/oauth2/token';
    const params = new URLSearchParams({
        grant_type: 'password',
        client_id: '3MVG9VMBZCsTL9hmf2p0c3rI_lhNesFf9GVcpDnM3Rk6kZaOaXMys68hpxYMevRPjCuifmM68clvjtTV2u9RL',
        client_secret: 'B067797C0C2B9402B72631CE1EC583E50B032D1C3AB10924C52889F6C72809FE',
        username: '2023mt93447@wilp.bits-pilani.ac.in',
        password: 'bits2023MTdWY6Umpneri3UdVMzXxqXfjv'
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (response.ok) {
            const data = await response.json();
            const newAccessToken = data.access_token;

            window.ACCESS_TOKEN = newAccessToken;
            alert('Token refreshed. You can now use the app.');
        } else {
            console.error('Failed to refresh token:', response.statusText);
            alert('Error: Failed to refresh token. Please try again.');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        alert('Error: Could not refresh token. Check the console for details.');
    }
}
document.getElementById('refresh-token-btn').addEventListener('click', refreshToken);