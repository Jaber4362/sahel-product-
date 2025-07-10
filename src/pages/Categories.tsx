import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Tag,
  Package,
  Palette,
  Save,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  created_at: string;
  product_count?: number;
}

const predefinedColors = [
  "#3B82F6", // أزرق أساسي
  "#6366F1", // بنفسجي أنيق  
  "#8B5CF6", // بنفسجي فاتح
  "#10B981", // أخضر زمردي
  "#F59E0B", // ذهبي دافئ
  "#EF4444", // أحمر مريح
  "#06B6D4", // تركوازي
  "#F97316", // برتقالي
  "#EC4899", // وردي
  "#6B7280"  // رمادي متوازن
];

const predefinedIcons = [
  "package", "smartphone", "shirt", "sofa", "book", "dumbbell", 
  "monitor", "headphones", "car", "home", "utensils", "gamepad"
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: predefinedColors[0],
    icon: predefinedIcons[0]
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    try {
      // جلب الفئات مع عدد المنتجات
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoriesError) throw categoriesError;

      // جلب عدد المنتجات لكل فئة
      const categoriesWithCount = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);
          
          return { ...category, product_count: count || 0 };
        })
      );

      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الفئات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchTerm) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // تحديث فئة موجودة
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: "تم التحديث",
          description: "تم تحديث الفئة بنجاح"
        });
      } else {
        // إضافة فئة جديدة
        const { error } = await supabase
          .from('categories')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء الفئة بنجاح"
        });
      }

      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ الفئة",
        variant: "destructive"
      });
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟ سيؤثر ذلك على المنتجات المرتبطة بها.")) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.filter(c => c.id !== id));
      toast({
        title: "تم الحذف",
        description: "تم حذف الفئة بنجاح"
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الفئة",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: predefinedColors[0],
      icon: predefinedIcons[0]
    });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const startEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
      icon: category.icon
    });
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الفئات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة الفئات</h1>
            <p className="text-muted-foreground mt-1">
              تنظيم وإدارة فئات المنتجات ({filteredCategories.length} فئة)
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-soft">
                <Plus className="h-4 w-4 mr-2" />
                إضافة فئة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">اسم الفئة</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="أدخل اسم الفئة"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="وصف الفئة (اختياري)"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>اللون</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-foreground' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({...formData, color})}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>الأيقونة</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {predefinedIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`p-2 rounded border ${
                          formData.icon === icon 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setFormData({...formData, icon})}
                      >
                        <Package className="h-4 w-4 mx-auto" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingCategory ? "تحديث" : "إنشاء"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="mb-6 bg-gradient-card shadow-soft border-0">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث في الفئات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardContent className="p-12 text-center">
              <Tag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد فئات"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "جرب تغيير كلمات البحث"
                  : "ابدأ بإضافة فئتك الأولى لتنظيم المنتجات"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <Package 
                          className="h-5 w-5" 
                          style={{ color: category.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">
                          {category.name}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => startEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => deleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Description */}
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {category.description}
                    </p>
                  )}

                  {/* Product Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {category.product_count || 0} منتج
                      </span>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>

                  {/* Created Date */}
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                    تم الإنشاء: {new Date(category.created_at).toLocaleDateString('ar-SA')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;