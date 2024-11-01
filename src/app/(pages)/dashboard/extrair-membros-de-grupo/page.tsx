"use client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertTriangle, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

interface ExtractedMember {
  phoneNumber: string;
  selected: boolean;
}
const ExtrairMembrosDeGrupo: React.FC = () => {
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [status, setStatus] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [extractedMembers, setExtractedMembers] = useState<ExtractedMember[]>(
    []
  );
  const [selectedGroupName, setSelectedGroupName] = useState("");
  useEffect(() => {
    // Simulate fetching groups from backend
    setTimeout(() => {
      const fakeGroups: Group[] = [
        { id: "group1", name: "Grupo Família", memberCount: 15 },
        { id: "group2", name: "Equipe de Trabalho", memberCount: 30 },
        { id: "group3", name: "Chat de Amigos", memberCount: 25 },
        { id: "group4", name: "Colaboração de Projeto", memberCount: 12 },
        { id: "group5", name: "Atualizações da Comunidade", memberCount: 50 },
      ];
      setGroups(fakeGroups);
    }, 1000);
  }, []);

  const handleExtractMembers = (groupId: string, groupName: string) => {
    setStatus(`Extraindo membros do grupo ${groupName}...`);
    setSelectedGroupName(groupName);
    // Simulate member extraction
    setTimeout(() => {
      const fakeMembers = [
        "+1234567890",
        "+9876543210",
        "+1122334455",
        "+5544332211",
        "+6677889900",
      ];
      setExtractedMembers(
        fakeMembers.map((number) => ({ phoneNumber: number, selected: false }))
      );
      setStatus(
        `Extraídos ${fakeMembers.length} membros de ${groupName} (simulado)`
      );
    }, 2000);
  };

  const toggleMemberSelection = (index: number) => {
    setExtractedMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, selected: !member.selected } : member
      )
    );
  };

  const toggleAllMembers = () => {
    setExtractedMembers((prev) => {
      const allSelected = prev.every((member) => member.selected);
      return prev.map((member) => ({ ...member, selected: !allSelected }));
    });
  };

  const saveContactList = (listName: string) => {
    const selectedMembers = extractedMembers.filter(
      (member) => member.selected
    );
    console.log(
      `Salvando lista "${listName}" com ${selectedMembers.length} contatos`
    );
    // Aqui você implementaria a lógica para salvar a lista no backend
  };

  const addSelectedMembersToPhoneNumbers = () => {
    const selectedNumbers = extractedMembers
      .filter((member) => member.selected)
      .map((member) => member.phoneNumber);

    const currentNumbers = phoneNumbers
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num !== "");
    const newNumbers = [...new Set([...currentNumbers, ...selectedNumbers])];
    setPhoneNumbers(newNumbers.join(", "));
    setStatus(
      `Adicionados ${selectedNumbers.length} números à lista de destinatários`
    );
  };

  const columns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Nome do Grupo",
    },
    {
      accessorKey: "memberCount",
      header: "Número de Membros",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const group = row.original;
        return (
          <Button onClick={() => handleExtractMembers(group.id, group.name)}>
            Extrair Membros
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: groups,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className=" max-w-screen-xl w-full shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-2xl">Extrair Membros do Grupo</CardTitle>
        <CardDescription>
          Selecione um grupo e extraia os números de telefone dos membros
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>
            Certifique-se de ter permissão para extrair informações dos membros
            do grupo e cumprir as políticas do WhatsApp.
          </AlertDescription>
        </Alert>
        <div className="rounded-md border mb-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {extractedMembers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Membros Extraídos de {selectedGroupName}:
            </h3>
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={toggleAllMembers}>
                Selecionar Todos
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              {extractedMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`member-${index}`}
                    checked={member.selected}
                    onCheckedChange={() => toggleMemberSelection(index)}
                  />
                  <label htmlFor={`member-${index}`} className="text-sm">
                    {member.phoneNumber}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input placeholder="Nome da nova lista" />
              <Button
                variant="outline"
                onClick={() => saveContactList("Nome da Lista")}
              >
                Salvar Lista
              </Button>
            </div>
            <Button
              onClick={addSelectedMembersToPhoneNumbers}
              className="w-full"
            >
              <ArrowRight className="mr-2 h-4 w-4" /> Adicionar Selecionados aos
              Destinatários
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {status && <p className="text-sm text-gray-500">{status}</p>}
      </CardFooter>
    </Card>
  );
};

export default ExtrairMembrosDeGrupo;
