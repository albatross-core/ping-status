import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  stripSearchParams,
} from "@tanstack/react-router";
import { ChevronsUpDown, Loader } from "lucide-react";
import { useState } from "react";
import z from "zod/v4";
import RequestDetails from "@/components/requests/request-details";
import RequestRow from "@/components/requests/request-row";
import RequestsFilters from "@/components/requests/requests-filters";
import ThemeToggle from "@/components/theme-toggle";
import { Sheet } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type client, orpc } from "@/lib/orpc";

export const Route = createFileRoute("/aldo2025/requests")({
  validateSearch: z.object({
    monitorName: z.array(z.string().trim().min(1)).default([]),
    statusCode: z.array(z.enum(["2xx", "4xx", "5xx"])).default([]),
    status: z.array(z.enum(["operational", "degraded", "down"])).default([]),
    incidentId: z.coerce.number().min(0).optional(),
    from: z.int().min(0).optional(),
    to: z.int().min(0).optional(),
    sort: z
      .object({
        field: z.enum(["createdAt", "responseTime"]).default("createdAt"),
        order: z.enum(["asc", "desc"]).default("desc"),
      })
      .default({ field: "createdAt", order: "desc" }),
  }),
  search: {
    middlewares: [
      stripSearchParams({
        monitorName: [],
        status: [],
        statusCode: [],
        sort: {
          field: "createdAt",
          order: "desc",
        },
      }),
    ],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    Promise.all([
      queryClient.ensureInfiniteQueryData(
        orpc.requests.infiniteOptions({
          initialPageParam: 1,
          getNextPageParam: (last) => last.meta.nextPage,
          getPreviousPageParam: (last) => last.meta.previousPage,
          input: (pageParam) => ({
            ...deps,
            limit: 100,
            page: pageParam,
          }),
        })
      ),
      queryClient.ensureQueryData(
        orpc.monitors.queryOptions({
          staleTime: Number.POSITIVE_INFINITY,
        })
      ),
    ]),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      orpc.requests.infiniteOptions({
        input: (pageParam) => ({
          ...search,
          limit: 100,
          page: pageParam,
        }),
        initialPageParam: 1,
        getNextPageParam: (last) => last.meta.nextPage,
        getPreviousPageParam: (last) => last.meta.previousPage,
      })
    );

  const [selectedRequest, setSelectedRequest] = useState<
    Awaited<ReturnType<typeof client.requests>>["requests"][number] | null
  >(null);

  const handleSort = (field: "createdAt" | "responseTime") => {
    const newSort = {
      field,
      order: search.sort.order === "asc" ? "desc" : ("asc" as "asc" | "desc"),
    };
    navigate({ search: { ...search, sort: newSort } });
  };

  return (
    <>
      <div className="grid h-screen grid-cols-[auto_1fr] overflow-hidden">
        <div className="grid w-72 grid-rows-[auto_1fr_auto] overflow-hidden border-r">
          <div className="flex items-center justify-between p-4">
            <Link to="/aldo2025">
              <h1 className="font-semibold text-lg">Albatross Status</h1>
            </Link>
            <ThemeToggle />
          </div>
          <div className="overflow-y-auto py-2">
            <RequestsFilters />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="sticky top-0 border-none bg-zinc-100 outline-1 outline-border hover:bg-zinc-100 dark:bg-zinc-900 hover:dark:bg-zinc-900">
              <TableHead className="border-r text-muted-foreground">
                Monitor
              </TableHead>
              <TableHead
                className="cursor-pointer border-r text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="">Date</span>
                  <ChevronsUpDown className="size-4" />
                </div>
              </TableHead>
              <TableHead className="border-r text-muted-foreground">
                Status Code
              </TableHead>
              <TableHead className="border-r text-muted-foreground">
                Method
              </TableHead>
              <TableHead className="border-r text-muted-foreground">
                Host
              </TableHead>
              <TableHead className="border-r text-muted-foreground">
                Pathname
              </TableHead>
              <TableHead
                className="cursor-pointer border-r text-muted-foreground hover:text-foreground"
                onClick={() => handleSort("responseTime")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>Response Time</span>
                  <ChevronsUpDown className="size-4" />
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages
              .flatMap((page) => page.requests)
              .map((request) => (
                <RequestRow
                  isSelected={request.id === selectedRequest?.id}
                  key={request.id}
                  onSelect={() =>
                    setSelectedRequest((prev) =>
                      prev?.id === request.id ? null : request
                    )
                  }
                  request={request}
                />
              ))}
            {hasNextPage && (
              <TableRow className="cursor-pointer">
                <TableCell colSpan={8} onClick={() => fetchNextPage()}>
                  <div className="flex items-center justify-center gap-2">
                    {isFetchingNextPage && (
                      <Loader className="size-4 animate-spin" />
                    )}
                    <span>
                      {isFetchingNextPage
                        ? "Loading more..."
                        : "Click to load more"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Sheet
        onOpenChange={() => setSelectedRequest(null)}
        open={!!selectedRequest}
      >
        <RequestDetails request={selectedRequest} />
      </Sheet>
    </>
  );
}
