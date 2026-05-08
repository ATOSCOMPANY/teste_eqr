/**
 * AnalysisTabs Component
 * Abas para múltiplos tipos de conteúdo na análise detalhada
 * Inclui: Planilha, Áudio, Documentos, Imagens, Notas, Links, Links de Comparação, Histórico
 */

import { useState } from 'react';
import {
  FileText,
  Mic,
  Files,
  Image,
  MessageSquare,
  Link as LinkIcon,
  Clock,
  Plus,
  Upload,
  Download,
  Trash2,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AudioRecorder from '@/components/AudioRecorder';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface AnalysisTabsProps {
  propertyId: string;
}

export default function AnalysisTabs({ propertyId }: AnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState('spreadsheet');
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Planilha Financeira.xlsx', size: '245 KB', date: '2026-05-01' },
    { id: '2', name: 'Documentação Legal.pdf', size: '1.2 MB', date: '2026-04-28' },
  ]);
  const [audios, setAudios] = useState([
    { id: '1', name: 'Análise Verbal - Parte 1', duration: '5:32', date: '2026-05-01' },
    { id: '2', name: 'Vistoria - Áudio', duration: '12:45', date: '2026-04-30' },
  ]);
  const [images, setImages] = useState([
    { id: '1', name: 'Fachada.jpg', size: '2.1 MB', date: '2026-04-29' },
    { id: '2', name: 'Sala.jpg', size: '1.8 MB', date: '2026-04-29' },
    { id: '3', name: 'Cozinha.jpg', size: '1.5 MB', date: '2026-04-28' },
  ]);
  const [notes, setNotes] = useState('Imóvel em excelente localização. Potencial de valorização significativo. Recomenda-se negociação para reduzir o valor de compra em 10-15%.');
  const [links, setLinks] = useState([
    { id: '1', url: 'https://www.imoveisweb.com.br/imovel/123456', title: 'Anúncio Original' },
    { id: '2', url: 'https://www.google.com/maps/place/Rua+das+Flores', title: 'Localização no Mapa' },
  ]);
  const [comparableLinks, setComparableLinks] = useState([
    { id: '1', url: 'https://www.imoveisweb.com.br/imovel/111111', title: 'Comparável 1 - Rua A', price: 'R$ 450.000' },
    { id: '2', url: 'https://www.imoveisweb.com.br/imovel/222222', title: 'Comparável 2 - Rua B', price: 'R$ 480.000' },
  ]);
  const [newComparableLink, setNewComparableLink] = useState('');
  const [newComparableTitle, setNewComparableTitle] = useState('');
  const [newComparablePrice, setNewComparablePrice] = useState('');
  const [history, setHistory] = useState([
    { id: '1', action: 'Análise criada', user: 'João Silva', date: '2026-05-01 14:30', status: 'Aprovado' },
    { id: '2', action: 'Dados atualizados', user: 'Maria Santos', date: '2026-04-30 10:15', status: 'Revisão' },
    { id: '3', action: 'Documentos adicionados', user: 'João Silva', date: '2026-04-28 16:45', status: 'Criado' },
  ]);

  const handleAddComparableLink = () => {
    if (newComparableLink.trim()) {
      setComparableLinks([
        ...comparableLinks,
        {
          id: Date.now().toString(),
          url: newComparableLink,
          title: newComparableTitle || 'Comparável',
          price: newComparablePrice || 'N/A',
        },
      ]);
      setNewComparableLink('');
      setNewComparableTitle('');
      setNewComparablePrice('');
    }
  };

  const handleRemoveComparableLink = (id: string) => {
    setComparableLinks(comparableLinks.filter((link) => link.id !== id));
  };

  const tabs: TabItem[] = [
    {
      id: 'spreadsheet',
      label: 'Planilha',
      icon: <FileText className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Planilhas de Análise</h3>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'audio',
      label: 'Áudio',
      icon: <Mic className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Gravações de Áudio</h3>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Gravar
            </Button>
          </div>

          {/* Audio Recorder */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <AudioRecorder
              onRecordingComplete={(blob, transcript) => {
                const newAudio = {
                  id: Date.now().toString(),
                  name: `Gravação - ${new Date().toLocaleTimeString('pt-BR')}`,
                  duration: '0:00',
                  date: new Date().toISOString().split('T')[0],
                };
                setAudios([...audios, newAudio]);
              }}
            />
          </div>

          {/* Existing Audios */}
          <div className="space-y-2">
            {audios.map((audio) => (
              <div key={audio.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{audio.name}</p>
                    <p className="text-xs text-gray-500">{audio.duration} • {audio.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    ▶
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'documents',
      label: 'Documentos',
      icon: <Files className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Documentos</h3>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <Files className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX (máx. 50MB)</p>
          </div>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'images',
      label: 'Imagens',
      icon: <Image className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Galeria de Imagens</h3>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-2 text-xs">
                  <p className="truncate font-medium text-gray-900">{img.name}</p>
                  <p className="text-gray-500">{img.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'notes',
      label: 'Notas',
      icon: <MessageSquare className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Notas da Análise</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-4 font-mono text-sm focus:border-green-500 focus:outline-none"
            rows={8}
            placeholder="Adicione notas sobre a análise..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700">Salvar Notas</Button>
          </div>
        </div>
      ),
    },
    {
      id: 'links',
      label: 'Links',
      icon: <LinkIcon className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Links Relacionados</h3>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Link
            </Button>
          </div>
          <div className="space-y-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-green-500 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <LinkIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{link.title}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </a>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'comparables',
      label: 'Comparáveis',
      icon: <Zap className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Links de Imóveis Comparáveis</h3>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Comparável
            </Button>
          </div>

          {/* Add Comparable Form */}
          <div className="rounded-lg bg-gray-50 p-4 space-y-3">
            <Input
              type="url"
              placeholder="https://www.imoveisweb.com.br/imovel/..."
              value={newComparableLink}
              onChange={(e) => setNewComparableLink(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Título (ex: Comparável 1 - Rua A)"
              value={newComparableTitle}
              onChange={(e) => setNewComparableTitle(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Preço (ex: R$ 450.000)"
              value={newComparablePrice}
              onChange={(e) => setNewComparablePrice(e.target.value)}
            />
            <Button
              onClick={handleAddComparableLink}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>

          {/* Comparable Links List */}
          <div className="space-y-2">
            {comparableLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-green-500 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 flex-shrink-0">
                    <LinkIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{link.title}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                    <p className="text-sm font-semibold text-green-600 mt-1">{link.price}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveComparableLink(link.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </a>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'history',
      label: 'Histórico',
      icon: <Clock className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Histórico de Versões</h3>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg border border-gray-200 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-900">{item.action}</p>
                    <span className={cn(
                      'inline-block px-2 py-1 rounded text-xs font-medium',
                      item.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                      item.status === 'Revisão' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.user}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
