import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, createCrudService, customRequest } from './api';
import type {
  ApiResponse,
  Organization,
  Node,
  Channel,
  ChainCode,
  User,
  LoginPayload,
  RegisterPayload,
} from '@/types';

// Auth
export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      apiRequest<{ token: string; user: { role: string } }>('/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      customRequest<ApiResponse>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}

export function useVerifyToken() {
  return useQuery({
    queryKey: ['token-verify'],
    queryFn: () => {
      const token = localStorage.getItem('baas-admin-token');
      if (!token) throw new Error('No token');
      return customRequest<{ user: User }>('/token-verify', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },
    enabled: !!localStorage.getItem('baas-admin-token'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

// Organization
const orgService = createCrudService<Organization>('organizations');

export function useOrganizations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['organizations', params],
    queryFn: () => orgService.list(params),
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => orgService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organizations'] }),
  });
}

export function useUpdateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      orgService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organizations'] }),
  });
}

// Node
const nodeService = createCrudService<Node>('nodes');

export function useNodes(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['nodes', params],
    queryFn: () => nodeService.list(params),
  });
}

export function useCreateNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => nodeService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nodes'] }),
  });
}

export function useRegisterUserToNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      customRequest(`/nodes/${id}/users`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nodes'] }),
  });
}

// Channel
const channelService = createCrudService<Channel>('channels');

export function useChannels(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['channels', params],
    queryFn: () => channelService.list(params),
  });
}

export function useCreateChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => channelService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });
}

export function useUpdateChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      channelService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });
}

// ChainCode
const chaincodeService = createCrudService<ChainCode>('chaincodes');

export function useChainCodes(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['chaincodes', params],
    queryFn: () => chaincodeService.list(params),
  });
}

export function useUploadChainCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      chaincodeService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chaincodes'] }),
  });
}

export function useInstallChainCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      customRequest(`/chaincodes/${id}/install`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chaincodes'] }),
  });
}

export function useApproveChainCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      customRequest(`/chaincodes/${id}/approve`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chaincodes'] }),
  });
}

export function useCommitChainCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      customRequest(`/chaincodes/${id}/commit`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chaincodes'] }),
  });
}

// User management
const userService = createCrudService<User>('users');

export function useUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.list(params),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => userService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
