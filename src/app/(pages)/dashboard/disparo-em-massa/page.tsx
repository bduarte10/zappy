"use client";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Paperclip, Send } from "lucide-react";
import React, { useRef } from "react";

const DisparoEmMassaPage: React.FC = () => {
  const [mediaFile, setMediaFile] = React.useState<File | null>(null);
  const [selectedContactList, setSelectedContactList] = React.useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className=" max-w-screen-xl w-full shadow-lg border-0">
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
        <form onSubmit={() => {}} className="space-y-4">
          <div>
            <label
              htmlFor="contactList"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lista de Contatos
            </label>
            <Select
              onValueChange={setSelectedContactList}
              value={selectedContactList}
            >
              <SelectTrigger id="contactList">
                <SelectValue placeholder="Selecione uma lista de contatos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="list1">Lista 1</SelectItem>
                <SelectItem value="list2">Lista 2</SelectItem>
                <SelectItem value="list3">Lista 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="phoneNumbers"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Números de Telefone Adicionais (separados por vírgula)
            </label>
            <Input
              id="phoneNumbers"
              value={""}
              onChange={() => {}}
              placeholder="ex: +1234567890, +9876543210"
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
              value={""}
              onChange={() => {}}
              placeholder="Digite sua mensagem aqui"
              required
              rows={4}
            />
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="w-full"
            >
              <Paperclip className="mr-2 h-4 w-4" />
              {mediaFile ? mediaFile.name : "Anexar Mídia"}
            </Button>
          </div>
          <Button type="submit" className="w-full">
            <Send className="mr-2 h-4 w-4" /> Iniciar Campanha
          </Button>
        </form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default DisparoEmMassaPage;
