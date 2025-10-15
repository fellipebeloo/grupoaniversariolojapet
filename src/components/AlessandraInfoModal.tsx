"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Store, Share2, Search, Plus, ShoppingCart } from 'lucide-react';

interface AlessandraInfoModalProps {
  children: React.ReactNode;
}

export const AlessandraInfoModal = ({ children }: AlessandraInfoModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 border-none bg-[#0f1418] text-white max-w-full sm:max-w-md h-dvh sm:h-[90vh] sm:rounded-lg flex flex-col">
        <DialogHeader className="p-4 bg-[#202c33] border-b border-gray-700 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                <ArrowLeft size={24} />
              </Button>
            </DialogTrigger>
            <DialogTitle className="text-white text-lg font-semibold">Dados da empresa</DialogTitle>
          </div>
          <Button variant="ghost" className="text-green-400 hover:bg-gray-700">
            Editar
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src="/alessandra.jpg" alt="Alessandra Palma" />
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">Alessandra Palma</h2>
              <ShoppingCart size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm">~Alessandra Palma</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button variant="ghost" className="flex flex-col h-auto py-3 text-gray-300 hover:bg-gray-700">
              <Phone size={20} className="mb-1" />
              <span className="text-xs">Ligar</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 text-gray-300 hover:bg-gray-700">
              <Store size={20} className="mb-1" />
              <span className="text-xs">Catálogo</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 text-gray-300 hover:bg-gray-700">
              <Share2 size={20} className="mb-1" />
              <span className="text-xs">Compartilhar</span>
            </Button>
            <Button variant="ghost" className="flex flex-col h-auto py-3 text-gray-300 hover:bg-gray-700">
              <Search size={20} className="mb-1" />
              <span className="text-xs">Pesquisar</span>
            </Button>
          </div>

          {/* Add Notes */}
          <div className="bg-[#202c33] rounded-lg p-3 flex items-center gap-3">
            <Plus size={20} className="text-green-400" />
            <span className="text-green-400 font-medium">Adicionar notas</span>
          </div>

          {/* Catalog Section */}
          <div className="bg-[#202c33] rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Catálogo</h3>
              <Button variant="link" className="text-green-400 p-0 h-auto">
                Mostrar tudo <ArrowLeft size={16} className="ml-1 rotate-180" />
              </Button>
            </div>
            <div className="w-full h-48 bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
              <img src="/placeholder.svg" alt="Catálogo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Fitness Instructor Section */}
          <div className="bg-[#202c33] rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Instrutor de fitness</h3>
            <p className="text-gray-300 text-sm mb-2">
              Comece hoje o melhor projeto da sua vida. Além Treinos/ Os melhores treinos para emagrecer e definir 💪
              <br />
              <span className="text-green-400">@alessandrappersonal</span>
            </p>
            <p className="text-gray-500 text-xs">8 de nov. de 2024</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};