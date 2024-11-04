"use client";
import { WhastappService } from "@/app/service/whatsapp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Send } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect } from "react";
import { toast } from "sonner";

interface Contact {
  id: string;
  number: string;
}

const DisparoEmMassaPage: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [message, setMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const queryClient = useQueryClient();

  // Obter contatos selecionados do cache
  useEffect(() => {
    const selectedContacts = queryClient.getQueryData<Contact[]>([
      "selectedContacts",
    ]);
    if (Array.isArray(selectedContacts) && selectedContacts.length > 0) {
      setContacts((prev) => {
        const newContacts = [...prev, ...selectedContacts];
        return Array.from(
          new Map(newContacts.map((item) => [item.id, item])).values()
        );
      });
      queryClient.setQueryData(["selectedContacts"], null);
    }
  }, [queryClient]);

  // Handler para mudança na mensagem
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Query para obter o status do WhatsApp
  const { data: hasWhatsAppSession = {}, isLoading: isLoadingStatus } =
    useQuery({
      queryKey: ["status"],
      queryFn: () => WhastappService.getStatus(),
      staleTime: 0,
    });

  useEffect(() => {
    if (!isLoadingStatus) {
      if (hasWhatsAppSession?.status === "false") {
        setOpen(true);
      } else if (hasWhatsAppSession?.status === "true") {
        setOpen(false);
      }
    }
  }, [hasWhatsAppSession, isLoadingStatus]);

  // Query para iniciar a sessão do WhatsApp
  const {
    data: startSessionData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["startSession"],
    queryFn: () => WhastappService.getSession(),
  });
  console.log("🚀 ~ startSessionData:", startSessionData);

  // useEffect(() => {
  //   if (open) {
  //     // Iniciar o intervalo para atualizar o QR code
  //     intervalRef.current = setInterval(() => {
  //       console.log("Atualizando QR code...");
  //       startSession();
  //     }, 10000);
  //   }

  // Limpar o intervalo quando o diálogo é fechado ou o componente é desmontado
  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   };
  // }, [open, startSession]);

  // Mutation para enviar mensagens
  const { mutate: sendMessages } = useMutation({
    mutationFn: async () => {
      const contactIds = contacts.map((contact) => contact.id);
      return await WhastappService.sendMessages(contactIds, message);
    },
    onMutate: () => {
      setIsSending(true);
    },
    onSuccess: () => {
      setContacts([]);
      setMessage("");
      toast.success(
        "Sua mensagem esta sendo enviada para todos os destinatários."
      );
    },
    onError: (error) => {
      console.error("Erro ao enviar mensagens:", error);
      toast.error("Erro ao enviar mensagens. Tente novamente.");
    },
    onSettled: () => {
      setIsSending(false);
    },
  });

  // Handler para o formulário de envio
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Digite uma mensagem");
      return;
    }
    if (contacts.length === 0) {
      alert("Adicione pelo menos um destinatário");
      return;
    }
    sendMessages();
  };

  return (
    <>
      <Card className="max-w-screen-xl w-full shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl">
            Nova Campanha de Disparo em Massa
          </CardTitle>
          <CardDescription>
            Envie mensagens com mídia para múltiplos contatos do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Aviso</AlertTitle>
            <AlertDescription>
              Certifique-se de ter permissão para enviar mensagens a esses
              contatos e cumprir as políticas do WhatsApp.
            </AlertDescription>
          </Alert>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="contacts"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Destinatários
              </label>
              <Input
                id="contacts"
                value={contacts.map((c) => c.number).join(", ")}
                readOnly
                placeholder="selecione contatos extraidos de grupos"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mensagem
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={handleMessageChange}
                placeholder="Digite sua mensagem aqui"
                required
                rows={4}
                disabled={isSending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Iniciar Campanha
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <Card className="w-[425px] ">
            <CardHeader>
              <DialogTitle>Conecte seu WhatsApp</DialogTitle>
              <CardDescription>
                Escaneie o QR code com seu WhatsApp para conectar
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {isLoading ? (
                <div className="w-[200px] h-[200px] flex items-center justify-center">
                  <Spinner />
                </div>
              ) : startSessionData?.qrCode === "" ? (
                <p className="w-[200px] h-[200px] text-red-500">
                  Erro ao carregar o QR code.
                </p>
              ) : startSessionData ? (
                <QRCodeCanvas
                  value={startSessionData?.qrCode || ""}
                  size={200}
                />
              ) : (
                <p className="w-[200px] h-[200px]">QR code não disponível.</p>
              )}
              <p className="text-sm text-gray-500 text-center mt-4">
                Abra o WhatsApp no seu celular, vá em Configurações {">"}{" "}
                Dispositivos conectados {">"} Conectar um dispositivo
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                Novo QR Code
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Sair
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisparoEmMassaPage;
