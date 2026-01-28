import { useEffect, useState, useMemo, useRef } from "react";
import { getImages, uploadImage } from "../../api/images.api";
import type { Image } from "../../types/image.types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/Card";
import { Button } from "../../components/Button";
import { Skeleton } from "../../components/Skeleton";
import { buildImageUrl, handleImageError, formatFileSize } from "../../utils/imageUtils";
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Search,
  Filter,
  FileImage,
  FileText
} from "lucide-react";

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [propertyId, setPropertyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>('all');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getImages();
      setImages(data as Image[]);
    } catch (error) {
      console.error("Error loading images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    
    // Create preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!file || !propertyId.trim()) {
      setMessage({text: "Selecciona una imagen y un ID de propiedad.", type: 'error'});
      return;
    }

    setUploading(true);
    try {
      await uploadImage(file, Number(propertyId));
      setFile(null);
      setPropertyId("");
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await loadImages();
      setMessage({text: "Imagen subida correctamente.", type: 'success'});
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({text: "No se pudo subir la imagen. Verifica los datos.", type: 'error'});
    } finally {
      setUploading(false);
    }
  };

  const getImageIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  // Usar la función importada
  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      const matchesSearch = image.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           image.id_casa?.toString().includes(searchTerm);
      const matchesType = filterType === 'all' || image.mimetype?.includes(filterType);
      return matchesSearch && matchesType;
    });
  }, [images, searchTerm, filterType]);

  const imageTypes = useMemo(() => {
    const types = new Set(images.map(img => img.mimetype?.split('/')[0] || 'other'));
    return Array.from(types);
  }, [images]);

  const stats = useMemo(() => ({
    total: images.length,
    images: images.filter(img => img.mimetype?.startsWith('image/')).length,
    other: images.filter(img => !img.mimetype?.startsWith('image/')).length
  }), [images]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        
        <Skeleton className="h-40 rounded-2xl" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestor de Imágenes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra las imágenes asociadas a las propiedades
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span>Total: {stats.total}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Imágenes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.images}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <FileImage className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Otros</p>
                <p className="text-2xl font-bold text-amber-600">{stats.other}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Nueva Imagen
          </CardTitle>
          <CardDescription>
            Selecciona una imagen y asigna el ID de propiedad correspondiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Imagen</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">ID de Propiedad</label>
                <input
                  type="number"
                  min={1}
                  placeholder="Ingrese el ID de la propiedad"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            {/* Preview */}
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-2">Vista previa:</p>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded-lg border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{file?.name}</p>
                    <p className="text-sm text-muted-foreground">{file && formatFileSize(file.size)}</p>
                    <p className="text-xs text-muted-foreground">{file?.type}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4">
              <Button 
                type="submit" 
                disabled={uploading || !file || !propertyId.trim()}
                className="min-w-[120px]"
              >
                {uploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Imagen
                  </>
                )}
              </Button>
              
              {message && (
                <div className={`px-4 py-2 rounded-lg text-sm ${
                  message.type === 'success' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {message.text}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre de archivo o ID de propiedad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Todos los tipos</option>
                {imageTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Imágenes</CardTitle>
              <CardDescription>
                {filteredImages.length} imagen{filteredImages.length !== 1 ? 'es' : ''} encontrado{filteredImages.length !== 1 ? 's' : ''}
                {searchTerm && ` para "${searchTerm}"`}
              </CardDescription>
            </div>
            {filteredImages.length > 0 && (
              <Button variant="outline" icon={<Download className="h-4 w-4" />}>
                Exportar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredImages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredImages.map((image) => (
                <Card key={image._id} hover className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image Preview */}
                    <div className="aspect-square bg-muted flex items-center justify-center relative group">
                      {image.path ? (
                        <img 
                          src={buildImageUrl(image.path, image.filename)} 
                          alt={image.filename}
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(e)}
                        />
                      ) : null}
                      <div className={`absolute inset-0 flex items-center justify-center ${image.path ? 'hidden' : ''}`}>
                        {getImageIcon(image.mimetype || '')}
                      </div>
                      
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="bg-white/90 hover:bg-white text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="bg-white/90 hover:bg-white text-foreground"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-medium text-foreground truncate">{image.filename}</h3>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Tipo:</span>
                          <span className="font-medium">{image.mimetype?.split('/')[1]?.toUpperCase() || 'DESCONOCIDO'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Propiedad:</span>
                          <span className="font-medium">#{image.id_casa}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tamaño:</span>
                          <span className="font-medium">{image.size ? formatFileSize(image.size) : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          icon={<Eye className="h-4 w-4" />}
                        >
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || filterType !== 'all' 
                  ? 'No se encontraron imágenes' 
                  : 'No hay imágenes registradas'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all'
                  ? 'Intenta con otros términos de búsqueda o filtros'
                  : 'Las imágenes aparecerán aquí una vez subidas'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
