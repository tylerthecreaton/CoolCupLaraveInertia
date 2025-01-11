import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Chip,
    Stack,
    IconButton,
    Paper,
    useTheme
} from '@mui/material';
import {
    BarChart,
    PieChart
} from '@mui/x-charts';
import {
    CurrencyExchange as CurrencyIcon,
    ShoppingBag as BagIcon,
    Assessment as ChartIcon,
    People as UsersIcon,
    CreditCard as CardIcon,
    Schedule as ClockIcon,
    Scale as ScaleIcon,
    Science as BeakerIcon,
    TrendingUp as TrendingUpIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';

export default function DailyReport({ stats }) {
    const theme = useTheme();

    // กำหนดชุดสีสำหรับ charts
    const chartColors = {
        sales: ['#2196f3', '#4dabf5', '#1976d2', '#1565c0', '#0d47a1'],
        drinks: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5'],
        payment: ['#4caf50', '#009688', '#00bcd4'],
        member: ['#ff9800', '#ff5722']
    };

    const sections = [
        {
            title: 'ข้อมูลการขาย',
            description: 'สรุปยอดขายและจำนวนออเดอร์ประจำวัน',
            items: [
                {
                    label: 'ยอดขายรวม',
                    value: stats?.totalSales || '0',
                    icon: CurrencyIcon,
                    format: 'currency',
                    color: 'primary',
                    bgColor: '#e3f2fd'
                },
                {
                    label: 'กำไรรวม',
                    value: stats?.totalProfit || '0',
                    icon: CurrencyIcon,
                    format: 'currency',
                    color: 'success',
                    bgColor: '#e8f5e9'
                },
                {
                    label: 'จำนวนออเดอร์',
                    value: stats?.totalOrders || '0',
                    icon: BagIcon,
                    color: 'secondary',
                    bgColor: '#fce4ec'
                }
            ]
        }
    ];

    const formatValue = (value, format) => {
        if (format === 'currency') {
            return new Intl.NumberFormat('th-TH', {
                style: 'currency',
                currency: 'THB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }
        return value;
    };

    // Format data for MUI X Charts
    const salesByTimeData = {
        xAxis: [{
            data: stats?.salesByTimeChart?.labels || [],
            scaleType: 'band',
        }],
        series: [
            {
                data: stats?.salesByTimeChart?.data || [],
                type: 'bar',
                label: 'ยอดขาย',
                color: chartColors.sales[0]
            },
            {
                data: stats?.salesByTimeChart?.data?.map(value => value * 1.2) || [],
                type: 'bar',
                label: 'เป้าหมาย',
                color: chartColors.sales[2]
            }
        ]
    };

    const topDrinksData = stats?.topDrinksChart?.data?.map((value, index) => ({
        value,
        label: stats.topDrinksChart.labels[index],
        color: chartColors.drinks[index]
    })) || [];

    const paymentMethodsData = stats?.paymentMethodsChart?.data?.map((value, index) => ({
        value,
        label: stats.paymentMethodsChart.labels[index],
        color: chartColors.payment[index]
    })) || [];

    const memberData = [
        { value: stats?.memberPercentage || 0, label: 'สมาชิก', color: chartColors.member[0] },
        { value: 100 - (stats?.memberPercentage || 0), label: 'ไม่เป็นสมาชิก', color: chartColors.member[1] }
    ];

    return (
        <AuthenticatedLayout
            header={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack spacing={1}>
                        <Typography variant="h5" component="h2" fontWeight="bold" color="primary">
                            รายงานประจำวัน
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Chip
                        icon={<TrendingUpIcon />}
                        label="+15.3% จากเมื่อวาน"
                        color="success"
                        sx={{
                            background: '#e8f5e9',
                            '& .MuiChip-icon': { color: '#2e7d32' }
                        }}
                    />
                </Box>
            }
        >
            <Head title="รายงานประจำวัน" />

            <Box sx={{ py: 3, bgcolor: '#f5f5f5' }}>
                <Box sx={{ px: { xs: 2, sm: 3, lg: 4 }, maxWidth: 'lg', mx: 'auto' }}>
                    <Stack spacing={3}>
                        {/* Summary Cards */}
                        {sections.map((section, index) => (
                            <Paper key={index} elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[2] }}>
                                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                                    <Typography variant="h6" component="h3" color="primary">
                                        {section.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {section.description}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                                    <Grid container spacing={2}>
                                        {section.items.map((item, itemIndex) => (
                                            <Grid item xs={12} md={4} key={itemIndex}>
                                                <Card 
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: 2,
                                                        background: 'white',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: theme.shadows[4]
                                                        }
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Box
                                                                sx={{
                                                                    p: 1.5,
                                                                    borderRadius: 2,
                                                                    bgcolor: item.bgColor,
                                                                    color: theme.palette[item.color].main
                                                                }}
                                                            >
                                                                <item.icon />
                                                            </Box>
                                                            <Box>
                                                                <Typography color="text.secondary" variant="body2" gutterBottom>
                                                                    {item.label}
                                                                </Typography>
                                                                <Typography variant="h6" component="div" color={item.color}>
                                                                    {formatValue(item.value, item.format)}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Paper>
                        ))}

                        {/* Charts Section */}
                        <Grid container spacing={3}>
                            {/* Sales by Time Chart */}
                            <Grid item xs={12} lg={6}>
                                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[2] }}>
                                    <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            ยอดขายตามช่วงเวลา
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            เปรียบเทียบยอดขายกับเป้าหมาย
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 3, height: 400, bgcolor: 'background.paper' }}>
                                        <BarChart
                                            xAxis={salesByTimeData.xAxis}
                                            series={salesByTimeData.series}
                                            height={350}
                                            sx={{
                                                '.MuiChartsAxis-line': { stroke: theme.palette.divider },
                                                '.MuiChartsAxis-tick': { stroke: theme.palette.divider }
                                            }}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Top Drinks Chart */}
                            <Grid item xs={12} lg={6}>
                                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[2] }}>
                                    <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    เครื่องดื่มยอดนิยม
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    5 อันดับเครื่องดื่มที่ขายดีที่สุด
                                                </Typography>
                                            </Box>
                                            <Chip
                                                size="small"
                                                label="+10.3%"
                                                color="success"
                                                sx={{
                                                    background: '#e8f5e9',
                                                    '& .MuiChip-label': { color: '#2e7d32' }
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ p: 3, height: 400, bgcolor: 'background.paper' }}>
                                        <PieChart
                                            series={[{
                                                data: topDrinksData,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30 },
                                                innerRadius: 60,
                                                paddingAngle: 2,
                                                cornerRadius: 4
                                            }]}
                                            height={350}
                                            slotProps={{
                                                legend: {
                                                    direction: 'row',
                                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                                    padding: 0
                                                }
                                            }}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Payment Methods Chart */}
                            <Grid item xs={12} lg={6}>
                                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[2] }}>
                                    <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            วิธีการชำระเงิน
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            สัดส่วนการชำระเงินแต่ละประเภท
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 3, height: 400, bgcolor: 'background.paper' }}>
                                        <PieChart
                                            series={[{
                                                data: paymentMethodsData,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30 },
                                                innerRadius: 60,
                                                paddingAngle: 2,
                                                cornerRadius: 4
                                            }]}
                                            height={350}
                                            slotProps={{
                                                legend: {
                                                    direction: 'row',
                                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                                    padding: 0
                                                }
                                            }}
                                        />
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <Typography variant="h6" color="primary">
                                                {paymentMethodsData[0]?.value || 0} ครั้ง
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Member Stats */}
                            <Grid item xs={12} lg={6}>
                                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[2] }}>
                                    <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="h6" gutterBottom color="primary">
                                                    สัดส่วนลูกค้า
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    เปรียบเทียบสัดส่วนลูกค้าสมาชิกและไม่เป็นสมาชิก
                                                </Typography>
                                            </Box>
                                            <Chip
                                                size="small"
                                                label="+5.2%"
                                                color="success"
                                                sx={{
                                                    background: '#e8f5e9',
                                                    '& .MuiChip-label': { color: '#2e7d32' }
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ p: 3, height: 400, bgcolor: 'background.paper' }}>
                                        <PieChart
                                            series={[{
                                                data: memberData,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30 },
                                                innerRadius: 60,
                                                paddingAngle: 2,
                                                cornerRadius: 4
                                            }]}
                                            height={350}
                                            slotProps={{
                                                legend: {
                                                    direction: 'row',
                                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                                    padding: 0
                                                }
                                            }}
                                        />
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <Typography variant="h6" color="primary">
                                                100%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
