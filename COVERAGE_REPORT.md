# Reporte de Cobertura de Pruebas
Fecha: 2026-05-15 | Proyecto: d3d6e2ea-ecbf-465c-87fc-3bc01dad9b67 | Modo: TDD

## 1. Resumen Ejecutivo
| Capa | Framework | Estado | Cobertura | Tests Pasados | Tests Fallidos |
|------|-----------|--------|-----------|---------------|----------------|
| Backend (app/) | pytest | FAIL | 77% | 22 | 15 |
| Backend | pytest | FAIL | 3% | 3 | 0 |

**Evaluación general:** Ambos backends tienen problemas críticos de ejecución. El backend principal (backend/app/) tiene 15 errores de setup relacionados con async/await en SQLAlchemy, lo que impide ejecutar los tests de API. El backend secundario tiene cobertura mínima del 3%. Se requiere corrección urgente del código de inicialización de base de datos.

## 2. KPIs de Calidad
| Indicador | Valor | Umbral | Estado |
|-----------|-------|--------|--------|
| Cobertura global (promedio) | 40% | ≥90% | FAIL |
| Tests totales ejecutados | 25 | - | - |
| Tests fallidos | 15 | 0 | FAIL |
| Capas sin cobertura | 0 | 0 | OK |

## 3. Detalle por Capa — Backend
| Archivo | %Stmts | %Branch | %Funcs | %Lines | Sin cubrir |
|---------|--------|---------|--------|--------|------------|
| __init__.py | 100% | - | - | 100% | - |
| api.py | 53% | - | - | 53% | 16-24, 29-30, 35-36, 41-44, 49-52 |
| crud.py | 100% | - | - | 100% | - |
| database.py | 50% | - | - | 50% | 13-17, 22-44 |
| deps.py | 50% | - | - | 50% | 7-11, 15 |
| main.py | 79% | - | - | 79% | 18, 27, 31-32 |
| models.py | 100% | - | - | 100% | - |
| tests/__init__.py | 100% | - | - | 100% | - |
| tests/test_api.py | 34% | - | - | 34% | 17-21, 25-26, 30-44, 48-57, 61-71, 75-89, 93-96, 100-115, 119-120, 124-137, 141-142, 146-160 |
| tests/test_crud.py | 100% | - | - | 100% | - |
| tests/test_database.py | 98% | - | - | 98% | 86 |
| tests/test_deps.py | 100% | - | - | 100% | - |
| tests/test_main.py | 43% | - | - | 43% | 10-17, 24-25, 29-30, 34-35, 39-40, 44-49, 53-55 |
| tests/test_models.py | 100% | - | - | 100% | - |

## 4. Detalle por Capa — Frontend
Sin tests de frontend encontrados

## 5. Tests Fallidos
| Test | Capa | Error | Prioridad |
|------|------|-------|-----------|
| test_create_dispatch_success | Backend (app/) | sqlalchemy.exc.MissingGreenlet: greenlet_spawn has not been called; can't call await_only() here. Was IO attempted in an unexpected place? | ALTA |
| test_create_dispatch_missing_required_field_returns_422 | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_create_dispatch_invalid_quantity_type_returns_422 | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_list_dispatches_returns_all_created_dispatches | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_list_dispatches_empty_returns_empty_list | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_get_dispatch_by_id_success | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_get_dispatch_by_id_not_found_returns_404 | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_delete_dispatch_success | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_delete_dispatch_not_found_returns_404 | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_get_dispatch_stats_by_plant_success | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_app_startup_initializes_database | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_app_includes_api_routes | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_app_structured_logging_configured | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_app_error_handling_returns_json_422 | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |
| test_app_error_handling_returns_json_404 | Backend (app/) | sqlalchemy.exc.MissingGreenlet (same) | ALTA |

## 6. Líneas Sin Cubrir (top 10 por impacto)
| Archivo | Líneas | Motivo probable |
|---------|--------|-----------------|
| tests/test_api.py | 48 | Tests no ejecutados por error en fixture client |
| tests/test_main.py | 21 | Tests no ejecutados por error en fixture client |
| api.py | 15 | Endpoints de validación y manejo de errores |
| database.py | 11 | Funciones de conexión y sesión |
| deps.py | 5 | Dependencias de autenticación/请求 |

## 7. Análisis de Calidad
### Fortalezas
- Los módulos core (crud.py, models.py) tienen 100% de cobertura
- Los tests de unidades de negocio (test_crud.py, test_deps.py, test_models.py) pasan correctamente
- La estructura general del proyecto permite ejecución de tests unitarios

### Áreas de Mejora
- Los tests de API y de aplicación fallan completamente debido a problema de async/await en el lifespan de la aplicación
- database.py tiene solo 50% de cobertura - las funciones de conexión no están siendo probadas
- deps.py tiene 50% de cobertura - las dependencias de usuario no están siendo probadas
- El backend secundario tiene 0% de cobertura en el código de aplicación

## 8. Recomendaciones (priorizadas)
1. **ALTA:** Corregir el error `sqlalchemy.exc.MissingGreenlet` en database.py y main.py - el problema está en que se usa `create_all()` de forma síncrona con un engine asíncrono (aiosqlite)
2. **ALTA:** Reparar los fixtures de test_main.py y test_api.py para que los tests de integración puedan ejecutarse
3. **MEDIA:** Aumentar cobertura en api.py (actualmente 53%) cubriendo los endpoints de validación
4. **MEDIA:** Aumentar cobertura en database.py (actualmente 50%) probando funciones de conexión
5. **BAJA:** Eliminar el backend duplicado en ./backend/ o documentar por qué existe como proyecto separado

## 9. Output Completo de Tests
### Backend (app/)
```
>>> [backend/app] Installing Python test dependencies...
>>> [backend/app] Running tests...
/usr/local/lib/python3.11/site-packages/pytest_asyncio/plugin.py:208: PytestDeprecationWarning: The configuration option "asyncio_default_fixture_loop_scope" is unset.
The event loop scope for asynchronous fixtures will default to the fixture caching scope. Future versions of pytest-asyncio will default the loop scope for asynchronous fixtures to function scope. Set the default fixture loop scope explicitly in order to avoid unexpected behavior in the future. Valid fixture loop scopes are: "function", "class", "module", "package", "session"

  warnings.warn(PytestDeprecationWarning(_DEFAULT_FIXTURE_LOOP_SCOPE_UNSET))
EEEEEEEEEEE................EEEEE......                                    [100%]
=================================== ERRORS ====================================
________________ ERROR at setup of test_create_dispatch_success ________________
tests/test_api.py:24: in client
    with TestClient(app) as c:
/home/appuser/.local/lib/python3.11/site-packages/starlette/testclient.py:745: in __enter__
    portal.call(self.wait_startup)
/home/appuser/.local/lib/python3.11/site-packages/anyio/from_thread.py:277: in call
    return cast(T_Retval, self.start_task_soon(func, *args).result())
/usr/local/lib/python3.11/concurrent/futures/_base.py:456: in result
    return self.__get_result()
/usr/local/lib/python3.11/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
/home/appuser/.local/lib/python3.11/site-packages/anyio/from_thread.py:217: in _call_func
    retval = await retval
/home/appuser/.local/lib/python3.11/site-packages/starlette/testclient.py:761: in wait_startup
    await receive()
/home/appuser/.local/lib/python3.11/site-packages/starlette/testclient.py:771: in receive
    self.task.result()
/usr/local/lib/python3.11/concurrent/futures/_base.py:449: in result
    return self.__get_result()
/usr/local/lib/python3.11/concurrent/futures/_base.py:401: in __get_result
    raise self._exception
/home/appuser/.local/lib/python3.11/site-packages/anyio/from_thread.py:217: in _call_func
    retval = await retval
/home/appuser/.local/lib/python3.11/site-packages/starlette/testclient.py:761: in lifespan
    await self.app(scope, self.stream_receive.receive, self.stream_send.send)
/home/appuser/.local/lib/python3.11/site-packages/fastapi/applications.py:292: in __call__
    await super().__call__(scope, receive, send)
/home/appuser/.local/lib/python3.11/site-packages/starlette/applications.py:122: in __call__
    await super().__call__(scope, receive, send)
/home/appuser/.local/lib/python3.11/site-packages/starlette/middleware/errors.py:149: in __call__
    await self.app(scope, receive, send)
/home/appuser/.local/lib/python3.11/site-packages/starlette/middleware/exceptions.py:55: in __call__
    await self.app(scope, receive, send)
/home/appuser/.local/lib/python3.11/site-packages/fastapi/middleware/asyncexitstack.py:20: in __call__
    raise e
/home/appuser/.local/lib/python3.11/site-packages/fastapi/middleware/asyncexitstack.py:17: in __call__
    raise e
/home/appuser/.local/lib/python3.11/site-packages/starlette/routing.py:707: in __call__
    await self.lifespan(scope, receive, send)
/home/appuser/.local/lib/python3.11/site-packages/starlette/routing.py:677: in lifespan
    async with self.lifespan_context(app) as maybe_state:
/usr/local/lib/python3.11/contextlib.py:210: in __aenter__
    return await anext(self.gen)
main.py:17: in lifespan
    init_db()
database.py:21: in init_db
    Base.metadata.create_all(bind=engine)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/sql/schema.py:5813: in create_all
    bind._run_ddl_visitor(
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/engine/base.py:3238: in begin
    with self.begin() as conn:
/home/appuser/.local/lib/python3.11/contextlib.py:137: in __enter__
    return next(self.gen)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/engine/base.py:3228: in begin
    with self.connect() as conn:
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/engine/base.py:3264: in connect
    return self._connection_cls(self)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/engine/base.py:145: in __init__
    self._dbapi_connection = engine.raw_connection()
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/engine/base.py:3288: in raw_connection
    return self.pool.connect()
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/pool/base.py:452: in connect
    return self._pool._invoke_creator(self)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/pool/base.py:1267: in _checkout
    fairy = _ConnectionRecord.checkout(pool)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/pool/base.py:716: in checkout
    rec = pool._do_get()
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/pool/impl.py:480: in _do_get
    rec = self.connection
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/pool/impl.py:437: in connection
    return self._ConnectionRecord(self)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/pool/base.py:678: in __init__
    self.__connect()
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/pool/base.py:902: in __connect
    with util.safe_reraise():
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/util/langhelpers.py:146: in __exit__
    raise exc_value.with_traceback(exc_tb)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/pool/base.py:898: in __connect
    self.dbapi_connection = connection = pool._invoke_creator(self)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/engine/create.py:637: in connect
    return dialect.connect(*cargs, **cparams)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/engine/default.py:615: in connect
    return self.loaded_dbapi.connect(*cargs, **cparams)
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/dialects/sqlite/aiosqlite.py:317: in connect
    await_only(connection),
/home/appuser/.local/lib/python3.11/site-packages/sqlalchemy/util/_concurrency_py3k.py:116: in await_only
    raise exc.MissingGreenlet(
E   sqlalchemy.exc.MissingGreenlet: greenlet_spawn has not been called; can't call await_only() here. Was IO attempted in an unexpected place? (Background on this error at: https://sqlalche.me/e/20/xd2s)
[... repeated for all 15 errors ...]
=============================== warnings summary ===============================
models.py:7
  /workspace/d3d6e2ea-ecbf-465c-87fc-3bc01dad9b67/backend/app/models.py:7: MovedIn20Warning: The ``declarative_base()`` function is now available as sqlalchemy.orm.declarative_base(). (deprecated since: 2.0) (Background on SQLAlchemy 2.0 at: https://sqlalche.me/e/b8d9)
    Base = declarative_base()

../../../../home/appuser/.local/lib/python3.11/site-packages/pydantic/_internal/_config.py:267
  /home/appuser/.local/lib/python3.11/site-packages/pydantic/_internal/_config.py:267: PydanticDeprecatedSince20: Support for class-based `config` is deprecated, use ConfigDict instead. Deprecated in Pydantic V2.0 to be removed in V3.0. See Pydantic V2 Migration Guide at https://errors.pydantic.dev/2.4/migration/
    warnings.warn(DEPRECATION_MESSAGE, DeprecationWarning)

../../../../home/appuser/.local/lib/python3.11/site-packages/pydantic/_internal/_config.py:317
  /home/appuser/.local/lib/python3.11/site-packages/pydantic/_internal/_config.py:317: UserWarning: Valid config keys have changed in V2:
  * 'orm_mode' has been renamed to 'from_attributes'
    warnings.warn(message, UserWarning)

tests/test_api.py: 10 warnings
tests/test_main.py: 5 warnings
  /usr/local/lib/python3.11/site-packages/httpx/_client.py:690: DeprecationWarning: The 'app' shortcut is now deprecated. Use the explicit style 'transport=WSGITransport(app=...)' instead.
    warnings.warn(message, DeprecationWarning)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
================================ tests coverage ================================
_______________ coverage: platform linux, python 3.11.15-final-0 _______________

Name                     Stmts   Miss  Cover   Missing
------------------------------------------------------
__init__.py                  0      0   100%
api.py                      32     15    53%   16-24, 29-30, 35-36, 41-44, 49-52
crud.py                     25      0   100%
database.py                 22     11    50%   13-17, 22-44
deps.py                     10      5    50%   7-11, 15
main.py                     19      4    79%   18, 27, 31-32
models.py                   34      0   100%
tests/__init__.py            0      0   100%
tests/test_api.py           73     48    34%   17-21, 25-26, 30-44, 48-57, 61-71, 75-89, 93-96, 100-115, 119-120, 124-137, 141-142, 146-160
tests/test_crud.py          52      0   100%
tests/test_database.py      45      1    98%   86
tests/test_deps.py          50      0   100%
tests/test_main.py          37     21    43%   10-17, 24-25, 29-30, 34-35, 39-40, 44-49, 53-55
tests/test_models.py        53      0   100%
------------------------------------------------------
TOTAL                      452    105    77%
Coverage JSON written to file coverage/coverage.json
=========================== short test summary info ============================
ERROR tests/test_api.py::test_create_dispatch_success - sqlalchemy.exc.Missin...
ERROR tests/test_api.py::test_create_dispatch_missing_required_field_returns_422
ERROR tests/test_api.py::test_create_dispatch_invalid_quantity_type_returns_422
ERROR tests/test_api.py::test_list_dispatches_returns_all_created_dispatches
ERROR tests/test_api.py::test_list_dispatches_empty_returns_empty_list - sqla...
ERROR tests/test_api.py::test_get_dispatch_by_id_success - sqlalchemy.exc.Mis...
ERROR tests/test_api.py::test_get_dispatch_by_id_not_found_returns_404 - sqla...
ERROR tests/test_api.py::test_delete_dispatch_success - sqlalchemy.exc.Missin...
ERROR tests/test_api.py::test_delete_dispatch_not_found_returns_404 - sqlalch...
ERROR tests/test_api.py::test_get_dispatch_stats_by_plant_success - sqlalchem...
ERROR tests/test_main.py::test_app_startup_initializes_database - sqlalchemy....
ERROR tests/test_main.py::test_app_includes_api_routes - sqlalchemy.exc.Missi...
ERROR tests/test_main.py::test_app_structured_logging_configured - sqlalchemy...
ERROR tests/test_main.py::test_app_error_handling_returns_json_422 - sqlalche...
ERROR tests/test_main.py::test_app_error_handling_returns_json_404 - sqlalche...
22 passed, 18 warnings, 15 errors in 100.30s (0:01:40)
>>> [backend/app] Done.
```

### Backend
```
>>> [backend] Installing Python test dependencies...
>>> [backend] Running tests...
/usr/local/lib/python3.11/site-packages/pytest_asyncio/plugin.py:208: PytestDeprecationWarning: The configuration option "asyncio_default_fixture_loop_scope" is unset.
The event loop scope for asynchronous fixtures will default to the fixture caching scope. Future versions of pytest-asyncio will default the loop scope for asynchronous fixtures to function scope. Set the default fixture loop scope explicitly in order to avoid unexpected behavior in the future. Valid fixture loop scopes are: "function", "class", "module", "package", "session"

  warnings.warn(PytestDeprecationWarning(_DEFAULT_FIXTURE_LOOP_SCOPE_UNSET))
...                                                                      [100%]
================================ tests coverage ================================
_______________ coverage: platform linux, python 3.11.15-final-0 _______________

Name                         Stmts   Miss  Cover   Missing
----------------------------------------------------------
app/__init__.py                  0      0   100%
app/api.py                      32     32     0%   1-52
app/crud.py                     25     25     0%   1-46
app/database.py                 22     22     0%   1-44
app/deps.py                     10     10     0%   1-15
app/main.py                     19     19     0%   1-32
app/models.py                   34     34     0%   1-51
app/tests/__init__.py            0      0   100%
app/tests/test_api.py           73     73     0%   1-160
app/tests/test_crud.py          52     52     0%   1-100
app/tests/test_database.py      45     45     0%   1-86
app/tests/test_deps.py          50     50     0%   1-68
app/tests/test_main.py          37     37     0%   1-55
app/tests/test_models.py        53     53     0%   1-117
tests/__init__.py                0      0   100%
tests/test_start.py             16      0   100%
----------------------------------------------------------
TOTAL                          468    452     3%
Coverage JSON written to file coverage/coverage.json
3 passed in 0.63s
>>> [backend] Done.
```

## 10. Metadata
| Campo | Valor |
|-------|-------|
| Generado | 2026-05-15 UTC |
| Modo | TDD (tests escritos antes del código) |
| Umbral configurado | ≥90% |
| Herramientas | pytest v7.4.3 / pytest-asyncio v0.21.1 |