import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Filter,
  SortAsc,
  AlertTriangle,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/ProductForm";
import ProductDetails from "@/components/ProductDetails";

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  unit: string;
  is_active: boolean;
  category_id: string;
  categories?: {
    name: string;
    color: string;
  };
}

type ViewMode = 'list' | 'add' | 'edit' | 'details';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل المنتجات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { text: "نفد المخزون", variant: "destructive" as const };
    if (current <= min) return { text: "مخزون منخفض", variant: "warning" as const };
    return { text: "متوفر", variant: "success" as const };
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "تم الحذف",
        description: "تم حذف المنتج بنجاح"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف المنتج",
        variant: "destructive"
      });
    }
  };

  const handleAddProduct = () => {
    setSelectedProductId(null);
    setViewMode('add');
  };

  const handleEditProduct = (id: string) => {
    setSelectedProductId(id);
    setViewMode('edit');
  };

  const handleViewDetails = (id: string) => {
    setSelectedProductId(id);
    setViewMode('details');
  };

  const handleFormClose = () => {
    setViewMode('list');
    setSelectedProductId(null);
  };

  const handleFormSave = () => {
    loadProducts();
    setViewMode('list');
    setSelectedProductId(null);
  };

  // Render different views based on mode
  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <ProductForm 
            productId={selectedProductId || undefined}
            onClose={handleFormClose}
            onSave={handleFormSave}
          />
        </div>
      </div>
    );
  }

  if (viewMode === 'details' && selectedProductId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <ProductDetails 
            productId={selectedProductId}
            onClose={handleFormClose}
            onEdit={() => {
              setViewMode('edit');
            }}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل المنتجات...</p>
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
            <h1 className="text-3xl font-bold text-foreground">إدارة المنتجات</h1>
            <p className="text-muted-foreground mt-1">
              إدارة شاملة لجميع منتجاتك ({filteredProducts.length} منتج)
            </p>
          </div>
          <Button className="bg-gradient-primary shadow-soft" onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة منتج جديد
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-gradient-card shadow-soft border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث في المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  تصفية
                </Button>
                <Button variant="outline" size="sm">
                  <SortAsc className="h-4 w-4 mr-2" />
                  ترتيب
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد منتجات"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "جرب تغيير كلمات البحث أو تطبيق مرشحات مختلفة"
                  : "ابدأ بإضافة منتجك الأول إلى النظام"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock_quantity, product.min_stock_level);
              
              return (
                <Card key={product.id} className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-foreground mb-1">
                          {product.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          رمز المنتج: {product.sku}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewDetails(product.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Category */}
                    {product.categories && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: product.categories.color }}
                        ></div>
                        <span className="text-sm text-muted-foreground">
                          {product.categories.name}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Price & Stock */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {product.price.toLocaleString('ar-SA')} ر.س
                          </p>
                          <p className="text-xs text-muted-foreground">
                            التكلفة: {product.cost_price.toLocaleString('ar-SA')} ر.س
                          </p>
                        </div>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.text}
                        </Badge>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">المخزون</span>
                          {product.stock_quantity <= product.min_stock_level && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>الكمية الحالية: <span className="font-semibold">{product.stock_quantity}</span></span>
                          <span>الحد الأدنى: {product.min_stock_level}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          الوحدة: {product.unit}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className={`text-xs font-medium ${product.is_active ? 'text-success' : 'text-muted-foreground'}`}>
                        {product.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs"
                        onClick={() => handleViewDetails(product.id)}
                      >
                        عرض التفاصيل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;