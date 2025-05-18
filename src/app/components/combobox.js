'use client'

import { useState, useEffect } from 'react'
import { Combobox } from '@headlessui/react'

export default function DesignComboBox({ onSelect, itemChange, changedSize, cs, changedBatch, inv, invdt, cn, ii }) {
    const [query, setQuery] = useState('')
    const [options, setOptions] = useState([])
    const [selected, setSelected] = useState('')
    const [data1, setData1] = useState([])
    function forselection(e) {
        // console.log("from combo", inv)
        setSelected(e)
        onSelect(e)
        let filterSize = invdt.filter(x => x.designname == e).map(z => z.size);
        let filterBatch = invdt.filter(x => x.designname == e && x.size == filterSize[0]).map(z => z.batchno);
        let ftd = invdt.filter(itm => itm.designname == e);

        cn(ftd[0]?.coname || "")
        // console.log("log from combo", invdt)
        // console.log("filtered sizes is", filterSize)
        // console.log("batchno is", filterBatch)

        changedSize(Array.from(new Set(filterSize)))
        changedBatch(Array.from(new Set(filterBatch)))
        cs({ ...ii, size: Array.from(new Set(filterSize))[0], batchno: Array.from(new Set(filterBatch))[0], coname: ftd[0]?.coname })


    }
    // Debounce search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim()) {
                fetch(`/api/searchdesign?query=${encodeURIComponent(query)}`)
                    .then((res) => res.json())
                    .then((data) => {
                        // console.log(data)
                        setData1(data.data)
                        setOptions(data.data.map(e => e.designname) || [])
                        inv(data.data)
                    })
                    .catch(() => setOptions([]))
            } else {
                setOptions([])
            }
        }, 1200) // debounce delay

        return () => clearTimeout(delayDebounce)
    }, [query])

    function handleChange(e) {
        // console.log("val log from combo", ftd)
        setQuery(e.target.value)
        itemChange(e)
    }
    return (
        <div className="w-full">
            <Combobox value={selected} onChange={forselection} name='designname'>
                <div className="relative">
                    <Combobox.Input
                        name='designname'
                        className="w-full border rounded p-2 "
                        placeholder="Search design..."
                        onChange={handleChange}
                        displayValue={(item) => item}
                    />
                    {options.length > 0 && (
                        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white">
                            {options.map((item, i) => (
                                <Combobox.Option
                                    key={i}
                                    value={item}
                                    className={({ active }) =>
                                        `cursor-pointer select-none p-2 ${active ? 'bg-blue-500 text-white' : 'text-black'
                                        }`
                                    }
                                >
                                    {item}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}
                </div>
            </Combobox>
        </div>
    )
}
