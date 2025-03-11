// Инициализация TON Connect
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://silver-selective-gamefowl-831.mypinata.cloud/ipfs/bafkreibrmjf3lwghgooju2afdvip7adgw74h24ybn25qrw7kgdgkgq4v2u',
    buttonRootId: 'connect-button-root'
});

// Обработчик изменения статуса подключения
tonConnectUI.onStatusChange(async (wallet) => {
    if (wallet) {
        try {
            // Получаем баланс и адрес кошелька
            const balanceElement = document.querySelector('.balance');
            const avatarElement = document.getElementById('user-avatar');
            
            // Получаем информацию о пользователе из Telegram
            if (wallet.device.platform === 'telegram') {
                const userInfo = wallet.device.appName; // Получаем информацию из кошелька
                if (userInfo && userInfo.avatar) {
                    avatarElement.style.backgroundImage = `url(${userInfo.avatar})`;
                    avatarElement.style.display = 'block';
                }
            }

            // Остальной код получения баланса
            const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${wallet.account.address}`);
            const data = await response.json();
            
            // Конвертируем баланс из нанотонов в TON
            const balance = data.result / 1000000000;
            balanceElement.textContent = `${balance.toFixed(2)} TON`;

            // Отправляем информацию на сервер
            await fetch('/api/wallet/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: wallet.account.address,
                    balance: balance
                })
            });
        } catch (error) {
            console.error('Ошибка:', error);
            document.querySelector('.balance').textContent = 'Ошибка получения данных';
        }
    } else {
        document.querySelector('.balance').textContent = 'Кошелёк не подключен';
        document.getElementById('user-avatar').style.display = 'none';
    }
});