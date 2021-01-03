/*******************************************************************************
 * Copyright (C) 2021 TRIALOG
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ServersService {
    private _CNILroute = '/pia-cnil';
    private _gatewayKey = 'gateway_url';
    private _RMTKey = 'rmt_url';
    private _appServerKey = 'server_url';


    constructor(private http: HttpClient) { }

    getRMTUrl()
    {
        return localStorage.getItem(this._RMTKey);
    }

    getAppServerUrl()
    {
        return localStorage.getItem(this._appServerKey);
    }

    /**
     * Also adds the route at the end.
     * This behavior may need to be changed as it's not consistent with the other methods
     */
    getPIAServerUrl()
    {
        return localStorage.getItem(this._gatewayKey);
    }

    getPIARoute()
    {
        return this._CNILroute;
    }

    setRMTUrl(url: string)
    {
        localStorage.setItem(this._RMTKey, url);
    }

    setAppServerUrl(url: string)
    {
        localStorage.setItem(this._appServerKey, url);
    }

    setPIAServerUrl(url: string)
    {
        localStorage.setItem(this._gatewayKey, url);
    }

    testUrl(url: string)
    {
        return this.http
            .get(url, { responseType: "text", observe: "response" })
            .pipe(
                timeout(2000),
                map( response =>
                    {
                        if(response.status !== 200)
                        {
                            console.log("Bad status from RMT server");
                            return false;
                        }
                        console.log("RMT server available");
                        return true;
                    }
                ),
                catchError(() => of(false))
            )
    }
}
