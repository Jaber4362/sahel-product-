import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Sun,
  Moon,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الإعدادات بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            الإعدادات
          </h1>
          <p className="text-muted-foreground mt-1">
            إدارة إعدادات النظام والتفضيلات الشخصية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <Card className="lg:col-span-2 bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                الإعدادات العامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">اسم الشركة</Label>
                  <Input id="company-name" placeholder="أدخل اسم الشركة" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">البريد الإلكتروني</Label>
                  <Input id="company-email" type="email" placeholder="company@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-address">العنوان</Label>
                <Input id="company-address" placeholder="أدخل عنوان الشركة" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" placeholder="+966 50 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">العملة الافتراضية</Label>
                  <Input id="currency" value="ريال سعودي" disabled />
                </div>
              </div>

              <Separator />

              {/* Theme Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  إعدادات المظهر
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5 text-primary" />
                    ) : (
                      <Sun className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">الوضع الداكن</p>
                      <p className="text-sm text-muted-foreground">
                        {theme === 'dark' ? 'مفعل حالياً' : 'غير مفعل'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </div>

              <Separator />

              {/* Notification Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  إعدادات الإشعارات
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">تنبيهات المخزون المنخفض</p>
                      <p className="text-sm text-muted-foreground">إشعار عند انخفاض المخزون</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">تنبيهات المنتجات الجديدة</p>
                      <p className="text-sm text-muted-foreground">إشعار عند إضافة منتج جديد</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">تقارير يومية</p>
                      <p className="text-sm text-muted-foreground">إرسال تقرير يومي بالإحصائيات</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  إدارة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  نسخ احتياطي من البيانات
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  استعادة البيانات
                </Button>
                <Button variant="outline" className="w-full justify-start text-warning">
                  <Database className="h-4 w-4 mr-2" />
                  مسح البيانات
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  الأمان والحماية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                <Button variant="outline" className="w-full">
                  تغيير كلمة المرور
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-primary shadow-soft border-0 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">حفظ التغييرات</h3>
                <p className="text-sm text-white/80 mb-4">
                  احفظ جميع التغييرات المطبقة على الإعدادات
                </p>
                <Button 
                  onClick={handleSave}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                  variant="outline"
                >
                  <Save className="h-4 w-4 mr-2" />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;