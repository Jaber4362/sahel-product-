import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Reports = () => {
  // بيانات وهمية للعرض التوضيحي
  const mockData = {
    totalSales: 125000,
    totalProducts: 45,
    lowStock: 8,
    profitMargin: 23.5,
    salesChange: 12.3,
    productChange: 5.2
  };

  // بيانات المبيعات للرسم البياني
  const salesData = [
    { month: 'يناير', sales: 12000, profit: 2400 },
    { month: 'فبراير', sales: 19000, profit: 3800 },
    { month: 'مارس', sales: 15000, profit: 3000 },
    { month: 'أبريل', sales: 25000, profit: 5000 },
    { month: 'مايو', sales: 22000, profit: 4400 },
    { month: 'يونيو', sales: 30000, profit: 6000 },
  ];

  // بيانات الفئات للرسم الدائري
  const categoryData = [
    { name: 'إلكترونيات', value: 35, color: 'hsl(240 100% 67%)' },
    { name: 'ملابس', value: 25, color: 'hsl(270 89% 65%)' },
    { name: 'كتب', value: 20, color: 'hsl(25 95% 53%)' },
    { name: 'أخرى', value: 20, color: 'hsl(142 71% 45%)' },
  ];

  // دالة تحميل التقرير - تعمل فعلياً
  const downloadReport = (type: string) => {
    // إنشاء محتوى التقرير
    const reportData = {
      تاريخ_التقرير: new Date().toLocaleDateString('ar-SA'),
      نوع_التقرير: type,
      إجمالي_المبيعات: `${mockData.totalSales.toLocaleString('ar-SA')} ر.س`,
      عدد_المنتجات: mockData.totalProducts,
      مخزون_منخفض: mockData.lowStock,
      هامش_الربح: `${mockData.profitMargin}%`,
      بيانات_المبيعات: salesData
    };

    // تحويل البيانات إلى JSON
    const jsonData = JSON.stringify(reportData, null, 2);
    
    // إنشاء ملف للتحميل
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // إنشاء رابط التحميل
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_${type}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // إشعار بنجاح التحميل
    toast({
      title: "تم تحميل التقرير بنجاح",
      description: `تم تحميل تقرير ${type} بصيغة JSON`,
    });
  };

  // دالة تحديث البيانات
  const refreshData = () => {
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث جميع التقارير والإحصائيات",
    });
  };

  // دالة التصفية
  const filterData = () => {
    toast({
      title: "فلتر البيانات",
      description: "سيتم تطبيق فلاتر متقدمة قريباً",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              التقارير والإحصائيات
            </h1>
            <p className="text-muted-foreground mt-1">
              تقارير مفصلة عن أداء المبيعات والمنتجات
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={filterData} className="hover-lift">
              <Filter className="h-4 w-4 mr-2" />
              تصفية
            </Button>
            <Button variant="outline" size="sm" onClick={refreshData} className="hover-lift">
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث
            </Button>
            <Button 
              onClick={() => downloadReport('شامل')} 
              className="bg-gradient-primary hover-lift shadow-soft"
            >
              <Download className="h-4 w-4 mr-2" />
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <Badge variant="success" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{mockData.salesChange}%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {mockData.totalSales.toLocaleString('ar-SA')} ر.س
              </h3>
              <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{mockData.productChange}%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {mockData.totalProducts}
              </h3>
              <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Package className="h-6 w-6 text-warning" />
                </div>
                <Badge variant="warning" className="text-xs">تحذير</Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {mockData.lowStock}
              </h3>
              <p className="text-sm text-muted-foreground">مخزون منخفض</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <Badge variant="success" className="text-xs">ممتاز</Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {mockData.profitMargin}%
              </h3>
              <p className="text-sm text-muted-foreground">هامش الربح</p>
            </CardContent>
          </Card>
        </div>

        {/* مخططات تفاعلية للمبيعات */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* رسم بياني للمبيعات */}
          <Card className="bg-gradient-card shadow-soft border-0 hover-lift animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary animate-pulse-soft" />
                مبيعات الأشهر الستة الماضية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-soft)'
                      }}
                    />
                    <Bar 
                      dataKey="sales" 
                      fill="hsl(240 100% 67%)" 
                      radius={[4, 4, 0, 0]}
                      name="المبيعات (ر.س)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* رسم دائري لتوزيع الفئات */}
          <Card className="bg-gradient-card shadow-soft border-0 hover-lift animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary animate-pulse-soft" />
                توزيع المبيعات حسب الفئات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                أفضل المنتجات مبيعاً
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">منتج رقم {item}</p>
                        <p className="text-sm text-muted-foreground">تم بيع {50 - item * 8} قطعة</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">{(1000 - item * 150).toLocaleString('ar-SA')} ر.س</p>
                      <p className="text-xs text-muted-foreground">إجمالي المبيعات</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                تقرير يومي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">مبيعات اليوم</span>
                  <span className="font-bold text-success">2,450 ر.س</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">منتجات مباعة</span>
                  <span className="font-bold">23 قطعة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">معدل الربح</span>
                  <span className="font-bold text-success">18.5%</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 hover-lift" 
                  onClick={() => downloadReport('يومي')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  تحميل التقرير
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                تقرير أسبوعي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">مبيعات الأسبوع</span>
                  <span className="font-bold text-success">18,750 ر.س</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">منتجات مباعة</span>
                  <span className="font-bold">187 قطعة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">معدل الربح</span>
                  <span className="font-bold text-success">21.3%</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 hover-lift" 
                  onClick={() => downloadReport('أسبوعي')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  تحميل التقرير
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                تقرير شهري
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">مبيعات الشهر</span>
                  <span className="font-bold text-success">125,000 ر.س</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">منتجات مباعة</span>
                  <span className="font-bold">1,250 قطعة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">معدل الربح</span>
                  <span className="font-bold text-success">23.5%</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 hover-lift" 
                  onClick={() => downloadReport('شهري')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  تحميل التقرير
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;