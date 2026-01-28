import { useState } from "react";
import { 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  FileArchive, 
  Folder,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Button } from "./Button";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { cn } from "../utils/cn";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
  owner: string;
  category: string;
  url: string;
  thumbnail?: string;
}

interface DocumentManagerProps {
  documents: Document[];
  onUpload: (files: File[]) => void;
  onDownload: (documentId: string) => void;
  onDelete: (documentId: string) => void;
  onView: (documentId: string) => void;
  className?: string;
}

export function DocumentManager({
  documents,
  onUpload,
  onDownload,
  onDelete,
  onView,
  className
}: DocumentManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <FileImage className="h-5 w-5 text-blue-500" />;
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes("sheet") || type.includes("excel")) return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    if (type.includes("zip") || type.includes("archive")) return <FileArchive className="h-5 w-5 text-amber-500" />;
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredDocuments = documents
    .filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || doc.category === categoryFilter)
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
          break;
        case "size":
          const sizeA = parseFloat(a.size);
          const sizeB = parseFloat(b.size);
          comparison = sizeA - sizeB;
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onUpload(files);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestor de Documentos</h2>
          <p className="text-muted-foreground mt-1">
            Administra todos tus documentos y archivos
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Subir Archivos
            </Button>
          </label>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <SortDesc className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="name">Nombre</option>
                <option value="date">Fecha</option>
                <option value="size">Tamaño</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocuments.map(document => (
            <Card key={document.id} hover className="overflow-hidden">
              <CardContent className="p-0">
                {/* Thumbnail or Icon */}
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {document.thumbnail ? (
                    <img 
                      src={document.thumbnail} 
                      alt={document.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getFileIcon(document.type)
                  )}
                  
                  {/* File extension badge */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {document.type.split('/').pop()?.toUpperCase() || 'FILE'}
                  </div>
                </div>

                {/* Document Info */}
                <div className="p-4">
                  <h3 className="font-medium text-foreground truncate mb-1">
                    {document.name}
                  </h3>
                  
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Categoría:</span>
                      <span className="font-medium">{document.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tamaño:</span>
                      <span className="font-medium">{document.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subido:</span>
                      <span className="font-medium">{formatDate(document.uploadedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Por:</span>
                      <span className="font-medium">{document.owner}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(document.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(document.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(document.id)}
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
        <Card>
          <CardContent className="text-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm || categoryFilter !== "all" 
                ? "No se encontraron documentos" 
                : "No hay documentos"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all"
                ? "Intenta con otros términos de búsqueda"
                : "Sube tu primer documento para comenzar"}
            </p>
            {!searchTerm && categoryFilter === "all" && (
              <label htmlFor="file-upload-empty">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Documento
                </Button>
              </label>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {documents.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">
                {documents.filter(d => d.type.includes('image')).length}
              </div>
              <div className="text-sm text-muted-foreground">Imágenes</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-red-500">
                {documents.filter(d => d.type.includes('pdf')).length}
              </div>
              <div className="text-sm text-muted-foreground">PDFs</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-500">
                {categories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categorías</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for document management
export function useDocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const uploadDocuments = async (files: File[]) => {
    setIsLoading(true);
    
    try {
      // Simulate upload process
      const newDocuments = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        uploadedAt: new Date(),
        owner: "Usuario Actual",
        category: getCategoryFromFileType(file.type),
        url: URL.createObjectURL(file)
      }));

      setDocuments(prev => [...prev, ...newDocuments]);
    } catch (error) {
      console.error("Error uploading documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocument = (documentId: string) => {
    const document = documents.find(d => d.id === documentId);
    if (document) {
      // In a real app, this would trigger actual download
      window.open(document.url, '_blank');
    }
  };

  const deleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== documentId));
  };

  const viewDocument = (documentId: string) => {
    const document = documents.find(d => d.id === documentId);
    if (document) {
      // In a real app, this would open a viewer modal
      window.open(document.url, '_blank');
    }
  };

  const getCategoryFromFileType = (type: string) => {
    if (type.includes('image')) return 'Imágenes';
    if (type.includes('pdf')) return 'Documentos';
    if (type.includes('sheet') || type.includes('excel')) return 'Hojas de cálculo';
    if (type.includes('zip') || type.includes('archive')) return 'Archivos comprimidos';
    return 'Otros';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    documents,
    isLoading,
    uploadDocuments,
    downloadDocument,
    deleteDocument,
    viewDocument
  };
}