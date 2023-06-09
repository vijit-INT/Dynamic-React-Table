import React, { useEffect, useState, forwardRef, useRef, useCallback } from "react";
import { useTable, useSortBy, usePagination, useColumnOrder, useFilters } from "react-table";
import { getUserData, searchingColumns } from '../Services/GetUserData';
import { ColumnFilter } from "./ColumnFilter";
const url = "https://fakestoreapi.com/products";

const tableColumn = [
    {
        Header: "ID",
        accessor: "id",
        Filter: ColumnFilter
    },
    {
        Header: "Email",
        accessor: "email",
        Filter: ColumnFilter
    },
    {
        Header: "First_Name",
        accessor: "first_name",
        Filter: ColumnFilter
    },
    {
        Header: "Last_Name",
        accessor: "last_name",
        Filter: ColumnFilter
    },
    {
        Header: "Avatar",
        accessor: "avatar",
        Filter: ColumnFilter,
        Cell: ({ row }) => <img src={row.values.avatar} style={{ height: "40px" }} />,
    }
];

const NewTable = () => {

    const [columns, setColumns] = useState([...tableColumn]);
    const [resp, setResp] = useState();
    const [data, setData] = useState([]);
    const [sortDirection, setSortDirection] = useState(null);


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        gotoPage,
        nextPage,
        previousPage,
        pageCount,
        pageOptions,
        setPageSize,
        canPreviousPage,
        canNextPage,
        state: { pageIndex, pageSize, filters },
        allColumns,
        getToggleHideAllColumnsProps
    } = useTable(
        {
            columns,
            data: data,
            initialState: { pageIndex: 0, pageSize: 3, sortBy: [] },
            manualPagination: true,
            pageCount: resp?.total_pages,
            manualSortBy: true,
            manualFilters: true,
        },
        useFilters,
        useSortBy,
        usePagination,
        useColumnOrder,

    );

    useEffect(() => {
        console.log("vijit singh")
        fetchData(pageIndex, pageSize)
    }, [pageIndex, pageSize]);

    const fetchData = (pageIndex, pageSize, filterParams) => {
        if (pageIndex === 0 && pageSize === 0 && filterParams) {
            searchingColumns(filterParams)
                .then((res) => {
                    if (res.data) {
                        let arr = []
                        arr.push(res.data)
                        setData([...arr]);
                        // setResp(res)
                    }
                })
                .catch((err) => console.log(err))
        } else {
            if (pageSize != 0 && filterParams === undefined) {

                getUserData(pageIndex + 1, pageSize, filterParams)
                    .then((res) => {
                        if (res.data && res.data.length > 0) {
                            setResp(res);
                            setData([...res.data])
                        }
                    })
                    .catch((err) => console.log(err))
            }
        }
    }

    const handleDragStart = (e, columnId) => {
        e.dataTransfer.setData("text/plain", columnId);
        console.log("e", e, "`columnId=>`", columnId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetColumnId) => {
        e.preventDefault();
        console.log("targetColumnId", targetColumnId);
        const sourceColumnId = e.dataTransfer.getData("text/plain");
        const sourceIndex = columns.findIndex(
            (column) => column.accessor === sourceColumnId
        );
        const targetIndex = columns.findIndex(
            (column) => column.accessor === targetColumnId
        );
        //    console.log("`sourceColumnId=>`",sourceColumnId,"`sourceIndex=>`",sourceIndex,"`targetIndex=>`",targetIndex)
        if (sourceIndex != targetIndex) {
            const newColumnOrder = [...columns];
            newColumnOrder.splice(
                targetIndex,
                0,
                newColumnOrder.splice(sourceIndex, 1)[0]
            );
            console.log("newColumnOrder=>", newColumnOrder);
            //setColumnOrder(newColumnOrder.map((column) => column.accessor));
            setColumns([...newColumnOrder]);
            console.log("newColumnOrder=>", newColumnOrder);
        }
    };

    const fetchFilter = useCallback(() => {
        const filterParams = filters.map(filter => `${filter.value}`).join('&')   //`${filter.id}=${filter.value}`).join('&');
        fetchData(0, 0, filterParams)
    }, [filters]);

    useEffect(() => {
        fetchFilter();
    }, [fetchFilter]);


    // const handleSort = (columnId) => {
    //     setData((prevData) => {
    //         const column = columns.find((col) => col.accessor === columnId);
    //         const isDesc = column.isSortedDesc;

    //         // Determine the new sorting direction
    //         const newIsDesc = !isDesc;

    //         // Update the isSorted and isSortedDesc properties of all columns
    //         columns.forEach((col) => {
    //             col.isSorted = col.accessor === columnId;
    //             col.isSortedDesc = col.accessor === columnId && newIsDesc;
    //         });

    //         // Sort the data based on the column and sorting direction
    //         const sorted = [...prevData].sort((a, b) => {
    //             if (a[columnId] < b[columnId]) return newIsDesc ? 1 : -1;
    //             if (a[columnId] > b[columnId]) return newIsDesc ? -1 : 1;
    //             return 0;
    //         });

    //         return sorted;
    //     });
    // };

    // const handleSort = (columnId) => {
    //     setData((prevData) => {
    //         const column = columns.find((col) => col.accessor === columnId);
    //         const isDesc = column.isSortedDesc;

    //         // Determine the new sorting direction
    //         let newIsDesc = true;
    //         if (columnId === sortedColumn?.id && sortedColumn?.isSortedDesc) {
    //             newIsDesc = false; // Revert to the original order
    //         }

    //         // Update the isSorted and isSortedDesc properties of all columns
    //         columns.forEach((col) => {
    //             col.isSorted = col.accessor === columnId;
    //             col.isSortedDesc = col.accessor === columnId && newIsDesc;
    //         });

    //         // Sort the data based on the column and sorting direction
    //         const sorted = [...prevData].sort((a, b) => {
    //             if (a[columnId] < b[columnId]) return newIsDesc ? 1 : -1;
    //             if (a[columnId] > b[columnId]) return newIsDesc ? -1 : 1;
    //             return 0;
    //         });

    //         // Update the sortedColumn state
    //         const newSortedColumn = {
    //             id: columnId,
    //             isSortedDesc: newIsDesc,
    //         };
    //         setSortedColumn(newSortedColumn);

    //         return sorted;
    //     });
    // };


    // const handleSort = (columnId) => {
    //     let direction = 'asc';

    //     if (sortConfig.key === columnId && sortConfig.direction === 'asc') {
    //       direction = 'desc'; // Sort in descending order if already sorted in ascending order
    //     }

    //     setSortConfig({ key: columnId, direction });

    //     const sorted = [...data].sort((a, b) => {
    //       if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1;
    //       if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1;
    //       return 0;
    //     });

    //     setData(sorted);
    //   };

    // const handleSort = (columnId) => {
    //     setData((prevData) => {
    //         const column = columns.find((col) => col.accessor === columnId);

    //         let newSortDirection;
    //         if (sortDirection === 'asc') {
    //             newSortDirection = 'desc'; // Sort in descending order
    //         } else if (sortDirection === 'desc') {
    //             newSortDirection = null; // Revert to the original order
    //         } else {
    //             newSortDirection = 'asc'; // Sort in ascending order
    //         }

    //         columns.forEach((col) => {
    //             col.isSorted = col.accessor === columnId;
    //             col.isSortedDesc = col.accessor === columnId && newSortDirection === 'desc';
    //         });

    //         let sorted;
    //         if (newSortDirection) {
    //             sorted = [...prevData].sort((a, b) => {
    //                 if (a[columnId] < b[columnId]) return newSortDirection === 'asc' ? -1 : 1;
    //                 if (a[columnId] > b[columnId]) return newSortDirection === 'asc' ? 1 : -1;
    //                 return 0;
    //             });
    //         } else {
    //             sorted = data; // Use the original unsorted data
    //         }

    //         setSortDirection(newSortDirection);
    //         return sorted;
    //     });
    // };

    const handleSort = (columnId) => {
        setData((prevData) => {
            const column = columns.find((col) => col.accessor === columnId);

            let newSortDirection;
            if (sortDirection === "asc") {
                newSortDirection = "desc"; // Sort in descending order
            } else if (sortDirection === "desc") {
                newSortDirection = null; // Revert to the original order
                setData(resp?.data); // Set the original data
            } else {
                newSortDirection = "asc"; // Sort in ascending order
            }

            columns.forEach((col) => {
                col.isSorted = col.accessor === columnId;
                col.isSortedDesc = col.accessor === columnId && newSortDirection === "desc";
            });

            let sorted;
            if (newSortDirection) {
                sorted = [...prevData].sort((a, b) => {
                    if (a[columnId] < b[columnId]) return newSortDirection === "asc" ? -1 : 1;
                    if (a[columnId] > b[columnId]) return newSortDirection === "asc" ? 1 : -1;
                    return 0;
                });
            } else {
                sorted = resp?.data; // Use the original unsorted data
            }

            setSortDirection(newSortDirection);
            return sorted;
        });
    };

    const IndeterminateCheckbox = forwardRef(
        ({ indeterminate, ...rest }, ref) => {
            const defaultRef = useRef()
            const resolvedRef = ref || defaultRef

            useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate
            }, [resolvedRef, indeterminate])

            return <input type="checkbox" ref={resolvedRef} {...rest} />
        }
    )

    return (
        <>
            <h1>React Table </h1>
            <div style={{ display: "flex", columnGap: "10px" }}>
                <div>
                    <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle All
                </div>
                {allColumns.map(column => (
                    <div key={column.id}>
                        <label>
                            <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
                            {column.id}
                        </label>
                    </div>
                ))}
                <br />
            </div>
            <table  {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, column.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, column.id)}
                                    onClick={() => handleSort(column.id)}

                                >
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? " 🔽"
                                                : " 🔼"
                                            : ""}
                                    </span>
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type='number'
                        min={1}
                        max={pageOptions.length}
                        // onChange={(value) => {
                        //   const page = value ? value - 1 : 0;
                        //   gotoPage(page);
                        // }}
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) : 0;
                            gotoPage(page - 1);
                        }}
                        style={{ width: "50px" }} />
                </span>
                <select value={pageSize} defaultValue={3} onChange={(e) => setPageSize(Number(e.target.value))}>
                    {
                        [3, 10, 50, 100, resp?.total].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))
                    }
                </select>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>Prev</button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>

            </div>
        </>
    );
};

export default NewTable;