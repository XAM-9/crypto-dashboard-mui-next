/* src/app/page.js */
'use client';

import { Paper, Typography, Box, useTheme, Divider, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { FaWallet, FaArrowUp, FaArrowDown, FaCube, FaHourglassHalf, FaChartBar, FaEthereum, FaBtc, FaDog, FaExchangeAlt, FaHistory } from 'react-icons/fa'; 
import { TbCoinBitcoin, TbCurrencyEthereum, TbCurrencySolana } from "react-icons/tb";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useMemo } from 'react';

// --- 1. Mock Data (ใช้ข้อมูลชุดเดิม) ---
const mockPortfolio = {
  totalValue: 125890.21,
  dailyChange: 5.12,
  dailyChangeAmount: 6150.34,
};

const mockAssets = [
  { name: 'Bitcoin', symbol: 'BTC', amount: 1.25, value: 85000.00, change: 5.12, isUp: true, icon: <TbCoinBitcoin /> },
  { name: 'Ethereum', symbol: 'ETH', amount: 20.5, value: 45000.50, change: -1.05, isUp: false, icon: <TbCurrencyEthereum /> },
  { name: 'Cardano', symbol: 'ADA', amount: 15000, value: 6500.50, change: 0.88, isUp: true, icon: <FaCube /> }, 
  { name: 'Solana', symbol: 'SOL', amount: 50, value: 8200.75, change: -2.11, isUp: false, icon: <TbCurrencySolana /> },
  { name: 'Dogecoin', symbol: 'DOGE', amount: 80000, value: 5000.00, change: 1.55, isUp: true, icon: <FaDog /> },
  // **ตัด Assets บางส่วนออกเพื่อความกระชับใน List ด้านล่าง**
  { name: 'Polkadot', symbol: 'DOT', amount: 500, value: 3500.00, change: -0.45, isUp: false, icon: <FaCube /> },
  { name: 'Chainlink', symbol: 'LINK', amount: 150, value: 3000.00, change: 2.30, isUp: true, icon: <FaCube /> },
];

const mockTransactions = [
  { id: 1, type: 'Buy', asset: 'BTC', amount: 0.05, price: 68000, total: 3400, date: '2023-10-26 10:30' },
  { id: 2, type: 'Sell', asset: 'ETH', amount: 1.2, price: 3200, total: 3840, date: '2023-10-25 15:45' },
  { id: 3, type: 'Buy', asset: 'ADA', amount: 100, price: 0.52, total: 52, date: '2023-10-24 09:00' },
  { id: 4, type: 'Buy', asset: 'SOL', amount: 5, price: 160, total: 800, date: '2023-10-23 11:15' },
  { id: 5, type: 'Sell', asset: 'DOGE', amount: 5000, price: 0.07, total: 350, date: '2023-10-22 17:00' },
  { id: 6, type: 'Buy', asset: 'BTC', amount: 0.1, price: 65000, total: 6500, date: '2023-10-21 08:00' },
  // **ตัด Transactions บางส่วนออกเพื่อจำกัดการแสดงผลเหลือ 6 รายการ**
];

const mockMarketStats = [
  { title: "24h Volume", value: "$125.8B", change: 5.55, icon: <FaChartBar /> },
  { title: "BTC Dominance", value: "54.1%", change: 1.12, icon: <FaHourglassHalf /> },
];

// --- 2. Chart Data & Motion (ใช้โค้ดเดิม) ---
const generateRandomData = (initialValue, points = 30) => {
  let data = [];
  let currentValue = initialValue;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * (initialValue * 0.005); 
    currentValue += change;
    data.push({ 
      name: `Time ${i + 1}`, 
      price: Math.max(initialValue * 0.9, currentValue)
    });
  }
  return data;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 }, // ลดระยะ Y
  visible: {
    y: 0,
    opacity: 1,
  },
};

// --- 3. Components (ปรับปรุงให้ Compact) ---

// 3.1 LivePriceChart (ลดความสูง)
const LivePriceChart = ({ title, coinColor, initialValue = 50000, height = '100%', subtitle }) => {
  const theme = useTheme();
  const [data, setData] = useState(() => generateRandomData(initialValue));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        newData.shift(); 
        const lastPrice = newData[newData.length - 1].price;
        const change = (Math.random() - 0.5) * (initialValue * 0.005);
        const newPrice = lastPrice + change;
        newData.push({
          name: `Time ${newData.length + 1}`,
          price: Math.max(initialValue * 0.9, newPrice) 
        });
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [initialValue]);

  const minPrice = useMemo(() => Math.min(...data.map(d => d.price)) * 0.99, [data]);
  const maxPrice = useMemo(() => Math.max(...data.map(d => d.price)) * 1.01, [data]);


  return (
    <motion.div variants={itemVariants} style={{ height: height }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
          {title}
        </Typography>
        {subtitle && <Typography variant="body2" color="textSecondary" mb={2}>{subtitle}</Typography>}
        <Box sx={{ flexGrow: 1, minHeight: 0 }}> 
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
              <XAxis dataKey="name" hide={true} />
              <YAxis domain={[minPrice, maxPrice]} hide={true} />
              <Tooltip 
                contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} 
                formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                labelStyle={{ color: theme.palette.text.primary, fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={coinColor} 
                strokeWidth={3} 
                dot={false}
                isAnimationActive={true}
                animationDuration={3000}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </motion.div>
  );
};

// 3.2 PortfolioSummaryCard (ใช้สำหรับแถบ Header Compact)
const PortfolioSummaryCard = ({ totalValue, dailyChange, dailyChangeAmount }) => {
    const theme = useTheme();
    const isUp = dailyChange >= 0;
    const changeColor = isUp ? theme.palette.success.main : theme.palette.error.main;
    const ChangeIcon = isUp ? FaArrowUp : FaArrowDown;
  
    return (
      <Box sx={{ p: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 0.5, fontWeight: 500 }}>Total Portfolio Balance</Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
              <ChangeIcon size={16} style={{ color: changeColor, marginRight: '6px' }} />
              <Typography variant="subtitle1" sx={{ color: changeColor, fontWeight: 'bold' }}>
                  {isUp ? '+' : ''}{dailyChange.toFixed(2)}%
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  (24h Change)
              </Typography>
          </Box>
      </Box>
    );
};

// 3.3 QuickStatCard (Minimal Stat Card)
const QuickStatCard = ({ title, value, change, icon }) => {
    const theme = useTheme();
    const isUp = change >= 0;
    const changeColor = isUp ? theme.palette.success.main : theme.palette.error.main;
  
    return (
        <motion.div variants={itemVariants} style={{ flexGrow: 1 }}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600 }}>{title}</Typography>
                    <Box sx={{ color: theme.palette.primary.main, fontSize: 20 }}>{icon}</Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', my: 1, color: theme.palette.text.primary }}>{value}</Typography>
                <Typography variant="body2" sx={{ color: changeColor, fontWeight: 'bold' }}>
                    {isUp ? '+' : ''}{change.toFixed(2)}%
                </Typography>
            </Paper>
        </motion.div>
    );
};

// 3.4 TransactionHistoryCard (จำกัดความสูง/จำนวนรายการ)
const TransactionHistoryCard = ({ transactions, limit = 6 }) => {
    const theme = useTheme();
  
    const TransactionItem = ({ tx }) => {
        const isBuy = tx.type === 'Buy';
        const typeColor = isBuy ? theme.palette.success.main : theme.palette.error.main;
        
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    py: 1.5, // ลด Padding
                    px: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box display="flex" alignItems="center">
                    <Box sx={{ 
                        color: typeColor, 
                        fontSize: 14, // ลดขนาด Font
                        mr: 1.5, 
                    }}>
                        {isBuy ? <FaArrowUp /> : <FaArrowDown />}
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {tx.type} {tx.asset}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">{tx.date.split(' ')[0]}</Typography>
                    </Box>
                </Box>
                <Box textAlign="right">
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: typeColor }}>
                        {isBuy ? '+' : '-'}${tx.total.toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
      <motion.div variants={itemVariants} style={{ height: '100%' }}>
        <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <FaHistory size={20} color={theme.palette.secondary.main} style={{ marginRight: '8px' }} />
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
              Recent Activity ({limit} Latest)
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}> {/* ห้าม Scroll */}
            {mockTransactions.slice(0, limit).map((tx) => ( 
              <motion.div key={tx.id} variants={itemVariants}>
                <TransactionItem tx={tx} />
              </motion.div>
            ))}
          </Box>
        </Paper>
      </motion.div>
    );
};

// 3.5 HoldingListCompact (ใช้สำหรับตารางด้านล่างแบบไม่ Scroll)
const HoldingListCompact = ({ assets, limit = 7 }) => {
    const theme = useTheme();

    const AssetRow = ({ asset }) => {
        const isUp = asset.change >= 0;
        const changeColor = isUp ? theme.palette.success.main : theme.palette.error.main;
        const ChangeIcon = isUp ? FaArrowUp : FaArrowDown;

        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    py: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box sx={{ minWidth: '150px', display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: theme.palette.primary.main, fontSize: 24, mr: 1.5 }}>{asset.icon}</Box>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{asset.symbol}</Typography>
                        <Typography variant="caption" color="textSecondary">{asset.name}</Typography>
                    </Box>
                </Box>

                <Box textAlign="right" sx={{ flexGrow: 1, mr: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>${asset.value.toLocaleString()}</Typography>
                    <Typography variant="caption" color="textSecondary">{asset.amount.toFixed(4)}</Typography>
                </Box>

                <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ minWidth: '80px' }}>
                    <ChangeIcon size={12} style={{ color: changeColor, marginRight: '4px' }} />
                    <Typography variant="body2" sx={{ color: changeColor, fontWeight: 'bold' }}>
                        {isUp ? '+' : ''}{asset.change.toFixed(2)}%
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <motion.div variants={itemVariants} style={{ height: '100%' }}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Asset Holdings (Top {limit})
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    {assets.slice(0, limit).map((asset, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <AssetRow asset={asset} />
                        </motion.div>
                    ))}
                </Box>
            </Paper>
        </motion.div>
    );
};


// --- 4. Main Dashboard Component (Home) - COMPACT SINGLE-PAGE LAYOUT ---

export default function Home() {
  const theme = useTheme();
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ width: '100%' }} 
    >
      <Box sx={{ py: 2, px: { xs: 2, sm: 4, md: 6 } }}> 

        {/* --- ROW 1: HEADER (Flex Row - Summary + Quick Stats) --- */}
        <motion.div variants={itemVariants}>
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
                
                {/* 1. Portfolio Summary (Flex) */}
                <PortfolioSummaryCard {...mockPortfolio} />

                {/* Divider (สำหรับ Mobile) */}
                <Divider orientation="horizontal" flexItem sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }} />

                {/* 2. Quick Stats (Flex) */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        flexDirection: { xs: 'column', sm: 'row' },
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end',
                    }}
                >
                    {mockMarketStats.map((stat, index) => (
                        <Box key={index} sx={{ flex: '1 1 200px' }}>
                             <QuickStatCard {...stat} />
                        </Box>
                    ))}
                    {/* ปุ่ม Trade/Action */}
                    <Box sx={{ flex: '1 1 150px' }}>
                        <Button 
                            variant="contained" 
                            fullWidth
                            sx={{ height: '100%', borderRadius: 3, fontWeight: 'bold' }} 
                            startIcon={<FaExchangeAlt />}
                        >
                            Trade/Swap
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </motion.div>


        {/* --- ROW 2: MAIN CONTENT (Flex Row - Chart + Lists) --- */}
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', lg: 'row' }, 
                gap: 4, 
                mb: 4, 
                // กำหนดความสูงรวมของแถวนี้ให้เหมาะสมกับหน้าจอทั่วไป (เช่น 60vh)
                height: { xs: 'auto', lg: '500px' } 
            }}
        >
            
            {/* 3. LEFT COLUMN (Chart Area - Flex: 60%) */}
            <Box sx={{ flex: '0 0 60%', height: '100%' }}>
                <LivePriceChart 
                    title="BTC Price Performance" 
                    subtitle="Key market trends over the last 24 hours"
                    coinColor={theme.palette.success.main}
                    initialValue={70000}
                />
            </Box>

            {/* 4. RIGHT COLUMN (Lists Area - Flex: 40%) */}
            <Box sx={{ flex: '0 0 40%', height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}> 
                
                {/* A. Transaction History (ใช้พื้นที่ 40%) */}
                <Box sx={{ flex: '0 0 40%', minHeight: '200px' }}>
                    <TransactionHistoryCard transactions={mockTransactions} limit={5} />
                </Box>
                
                {/* B. Secondary Chart (ใช้พื้นที่ 60%) */}
                <Box sx={{ flex: '0 0 60%', minHeight: '250px' }}>
                    <LivePriceChart 
                        title="ETH/USD Fluctuation" 
                        coinColor={theme.palette.primary.main}
                        initialValue={4000}
                    />
                </Box>
            </Box>
        </Box>
        
        {/* --- ROW 3: DETAILED ASSET HOLDINGS (Full Width - Compact List) --- */}
        <Box sx={{ mb: 2 }}>
            <HoldingListCompact assets={mockAssets} limit={7} />
        </Box>


        {/* Footer Minimal */}
        <Box sx={{ mt: 3, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" align="center" display="block" color="textSecondary">
            Compact Single-Page Dashboard. Optimized for screen height.
          </Typography>
        </Box>

      </Box>
    </motion.div>
  );
}