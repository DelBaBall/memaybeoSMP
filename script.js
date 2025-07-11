document.addEventListener('DOMContentLoaded', () => {
    const servers = {
        'server-thu-nghiem': 'your_trial_server_ip:25565', // Thay thế bằng IP và port của máy chủ thử nghiệm
        'server-sinh-ton': 'your_survival_server_ip:25565', // Thay thế bằng IP và port của máy chủ sinh tồn
        'server-boxpvp-18': 'your_boxpvp_1_8_server_ip:25565', // Thay thế bằng IP và port của máy chủ BoxPvP 1.8.x
        'server-boxpvp-19': 'your_boxpvp_1_9_server_ip:25565'  // Thay thế bằng IP và port của máy chủ BoxPvP 1.9+
    };

    const discordLink = 'YOUR_DISCORD_INVITE_LINK'; // Đảm bảo link này khớp với link trong HTML

    // Cập nhật link Discord trong JavaScript nếu cần (cho mục đích sử dụng sau này hoặc API Discord)
    const discordButton = document.querySelector('.discord-button');
    if (discordButton) {
        discordButton.href = discordLink;
    }

    async function fetchServerStatus(serverId, ipAddress) {
        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${ipAddress}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            updateServerInfo(serverId, data);
        } catch (error) {
            console.error(`Lỗi khi lấy trạng thái máy chủ ${serverId}:`, error);
            updateServerInfo(serverId, { online: false }); // Cập nhật trạng thái offline nếu có lỗi
        }
    }

    function updateServerInfo(serverId, data) {
        const serverCard = document.getElementById(serverId);
        if (!serverCard) return;

        const ipSpan = serverCard.querySelector('.server-ip');
        const motdSpan = serverCard.querySelector('.server-motd');
        const playersSpan = serverCard.querySelector('.server-players');
        const versionSpan = serverCard.querySelector('.server-version');
        const pingSpan = serverCard.querySelector('.server-ping');

        if (data.online) {
            ipSpan.textContent = data.host || 'N/A';
            // Xử lý MOTD: mcstatus.io trả về MOTD đã định dạng HTML trong data.motd.html
            // Để hiển thị an toàn, chúng ta có thể sử dụng data.motd.clean hoặc loại bỏ các thẻ HTML
            motdSpan.innerHTML = data.motd.html ? data.motd.html : data.motd.clean || 'Không có MOTD';
            playersSpan.textContent = `${data.players.online}/${data.players.max}`;
            versionSpan.textContent = data.version.name_clean || 'N/A';
            pingSpan.textContent = data.latency ? Math.round(data.latency) : 'N/A';
            serverCard.style.borderColor = 'rgba(0, 255, 0, 0.5)'; // Màu xanh lá khi online
            serverCard.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
        } else {
            ipSpan.textContent = servers[serverId]; // Hiển thị IP đã cấu hình
            motdSpan.textContent = 'Máy chủ OFFLINE';
            playersSpan.textContent = '0/0';
            versionSpan.textContent = 'Không khả dụng';
            pingSpan.textContent = 'Không khả dụng';
            serverCard.style.borderColor = 'rgba(255, 0, 0, 0.5)'; // Màu đỏ khi offline
            serverCard.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.5)';
        }
    }

    // Lấy trạng thái máy chủ khi tải trang
    for (const serverId in servers) {
        fetchServerStatus(serverId, servers[serverId]);
    }

    // Tự động cập nhật trạng thái mỗi 30 giây
    setInterval(() => {
        for (const serverId in servers) {
            fetchServerStatus(serverId, servers[serverId]);
        }
    }, 30000); // 30 giây
});
