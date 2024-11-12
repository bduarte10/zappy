"use client";
import { Group, WhastappService } from "@/app/service/whatsapp";
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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ExtractedMember {
  id: string;
  phoneNumber: string;
  name: string;
  selected: boolean;
}

const ExtrairMembrosDeGrupo: React.FC = () => {
  const [status, setStatus] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [extractedMembers, setExtractedMembers] = useState<ExtractedMember[]>(
    []
  );
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");

  const router = useRouter();
  const queryClient = useQueryClient();

  // Query para obter os grupos
  const { data: groupsData, isLoading: isGroupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await WhastappService.getGroups();
      return response;
    },
  });

  useEffect(() => {
    if (!isGroupsLoading && groupsData) {
      setGroups(groupsData.groups);
    }
  }, [isGroupsLoading, groupsData]);

  // Query para obter os membros extraídos
  const {
    data: groupMembers,
    refetch: fetchMembers,
    isLoading: isLoadingMembers,
  } = useQuery({
    queryKey: ["extractedMembers"],
    queryFn: async () => {
      const response = await WhastappService.getExtractedMembers(
        selectedGroupId
      );
      return response;
    },
    enabled: !!selectedGroupId, // Desabilitado por padrão, será ativado manualmente
  });

  useEffect(() => {
    if (!isLoadingMembers && groupMembers) {
      setExtractedMembers(
        groupMembers.contacts.map((contact) => ({
          id: contact.id,
          phoneNumber: contact.number,
          name: contact.name,
          selected: false,
        }))
      );
    }
  }, [groupMembers, isLoadingMembers]);

  const handleExtractMembers = React.useCallback(
    (groupId: string, groupName: string) => {
      setSelectedGroupName(groupName);
      setSelectedGroupId(groupId);

      setStatus("Extraindo membros...");
      fetchMembers();
    },
    [fetchMembers]
  );

  const addSelectedMembersToPhoneNumbers = () => {
    const selectedContacts = extractedMembers
      .filter((member) => member.selected)
      .map((member) => ({
        id: member.id,
        number: member.phoneNumber,
        name: member.name,
      }));

    // Armazenar contatos selecionados no cache
    queryClient.setQueryData(["selectedContacts"], selectedContacts);

    // Redirecionar para página de disparo
    router.push("/dashboard/disparo-em-massa");
  };

  const columns: ColumnDef<Group>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nome do Grupo",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const group = row.original;
          return (
            <Button
              onClick={() => handleExtractMembers(group.id, group.name)}
              disabled={
                status === "Extraindo membros..." ||
                extractedMembers?.length > 0
              }
            >
              Extrair Membros
            </Button>
          );
        },
      },
    ],
    [handleExtractMembers, status, extractedMembers]
  );

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
          <AlertDescription className="text-sm  font-bold">
            Esta operação pode levar algum tempo, dependendo da quantidade de
            grupos.
          </AlertDescription>
        </Alert>
        <div className="rounded-md border mb-4 max-h-[600px] overflow-auto">
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
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    {isGroupsLoading ? <Spinner /> : "Nenhum grupo encontrado"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Dialog open={extractedMembers?.length > 0}>
          <DialogContent>
            <DialogTitle className="sr-only">Membros Extraídos</DialogTitle>
            {extractedMembers?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Membros Extraídos de {selectedGroupName}:
                </h3>
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={toggleAllMembers}>
                    {extractedMembers.every((member) => member.selected)
                      ? "Desmarcar Todos"
                      : "Selecionar Todos"}
                  </Button>
                  <Button
                    onClick={addSelectedMembersToPhoneNumbers}
                    disabled={
                      !extractedMembers.some((member) => member.selected)
                    }
                  >
                    Adicionar aos Destinatários
                  </Button>
                </div>
                <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                  {extractedMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`member-${index}`}
                        checked={member.selected}
                        onCheckedChange={() => toggleMemberSelection(index)}
                      />
                      <label htmlFor={`member-${index}`} className="text-sm">
                        {member.name} ({member.phoneNumber})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter>
        {status && <p className="text-sm text-gray-500">{status}</p>}
      </CardFooter>
    </Card>
  );
};

export default ExtrairMembrosDeGrupo;
